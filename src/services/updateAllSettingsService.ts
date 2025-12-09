import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../config/sequelize";
import { tagRepository } from "../repositories/tagRepository";
import { messageTemplateRepository } from "../repositories/messageTemplateRepository";
import { emailSignatureRepository } from "../repositories/emailSignatureRepository";
import { configurationRepository } from "../repositories/configurationRepository";
import { htmlSanitizer } from "../utils/htmlSanitizer";
import { AppError } from "../utils/AppError";
import { UpdateAllSettingsDTO, AllSettingsResponse } from "../types/settings";
import { TagItemDTO } from "../types/tag";
import { MessageTemplateItemDTO } from "../types/messageTemplate";
import { UpdateConfigurationItemDTO } from "../types/configuration";

export const updateAllSettingsService = {
  async execute(data: UpdateAllSettingsDTO): Promise<AllSettingsResponse> {
    return sequelize.transaction(async (transaction) => {
      if (data.tags) {
        await this.syncTags(data.tags, transaction);
      }

      if (data.messageTemplates) {
        await this.syncMessageTemplates(data.messageTemplates, transaction);
      }

      if (data.emailSignature) {
        await this.updateEmailSignature(
          data.emailSignature.htmlContent,
          transaction
        );
      }

      if (data.configurations) {
        await this.updateConfigurations(data.configurations);
      }

      const [tags, messageTemplates, emailSignature, configurations] =
        await Promise.all([
          tagRepository.findAll(),
          messageTemplateRepository.findAll(),
          emailSignatureRepository.findOne(),
          configurationRepository.findAll(),
        ]);

      return {
        tags: tags.map((tag) => ({
          externalId: tag.externalId,
          name: tag.name,
          backgroundColor: tag.backgroundColor,
          textColor: tag.textColor,
          createdAt: tag.createdAt,
          updatedAt: tag.updatedAt,
        })),
        messageTemplates: messageTemplates.map((template) => ({
          externalId: template.externalId,
          name: template.name,
          htmlContent: template.htmlContent,
          createdAt: template.createdAt,
          updatedAt: template.updatedAt,
        })),
        emailSignature: emailSignature
          ? {
              externalId: emailSignature.externalId,
              htmlContent: emailSignature.htmlContent,
              createdAt: emailSignature.createdAt,
              updatedAt: emailSignature.updatedAt,
            }
          : null,
        configurations: configurations.map((config) => ({
          externalId: config.externalId,
          code: config.code,
          display: config.display,
          options: config.options,
          selected: config.selected,
          isActive: config.isActive,
          createdAt: config.createdAt,
          updatedAt: config.updatedAt,
        })),
      };
    });
  },

  async syncTags(
    items: TagItemDTO[],
    transaction: import("sequelize").Transaction
  ): Promise<void> {
    const existingTags = await tagRepository.findAll();
    const existingExternalIds = existingTags.map((t) => t.externalId);
    const incomingExternalIds = items
      .filter((item) => item.externalId)
      .map((item) => item.externalId as string);

    const toDelete = existingTags.filter(
      (tag) => !incomingExternalIds.includes(tag.externalId)
    );
    if (toDelete.length > 0) {
      await tagRepository.deleteByIds(
        toDelete.map((t) => t.id),
        transaction
      );
    }

    const usedNames = new Set<string>();
    for (const item of items) {
      const normalizedName = item.name.trim().toLowerCase();
      if (usedNames.has(normalizedName)) {
        throw AppError.badRequest(`Duplicate tag name: ${item.name}`);
      }
      usedNames.add(normalizedName);

      if (item.externalId && existingExternalIds.includes(item.externalId)) {
        const existing = existingTags.find(
          (t) => t.externalId === item.externalId
        );
        if (existing) {
          const nameConflict = await tagRepository.existsByNameExcludingId(
            item.name,
            existing.id
          );
          if (nameConflict) {
            throw AppError.badRequest(`Tag name already exists: ${item.name}`);
          }
          await tagRepository.update(
            existing.id,
            {
              name: item.name,
              backgroundColor: item.backgroundColor,
              textColor: item.textColor,
            },
            transaction
          );
        }
      } else {
        const existingByName = await tagRepository.findByName(item.name);
        if (existingByName) {
          throw AppError.badRequest(`Tag name already exists: ${item.name}`);
        }
        await tagRepository.create(
          {
            externalId: uuidv4(),
            name: item.name,
            backgroundColor: item.backgroundColor,
            textColor: item.textColor,
          },
          transaction
        );
      }
    }
  },

  async syncMessageTemplates(
    items: MessageTemplateItemDTO[],
    transaction: import("sequelize").Transaction
  ): Promise<void> {
    for (const item of items) {
      htmlSanitizer.validate(item.htmlContent);
    }

    const existingTemplates = await messageTemplateRepository.findAll();
    const existingExternalIds = existingTemplates.map((t) => t.externalId);
    const incomingExternalIds = items
      .filter((item) => item.externalId)
      .map((item) => item.externalId as string);

    const toDelete = existingTemplates.filter(
      (template) => !incomingExternalIds.includes(template.externalId)
    );
    if (toDelete.length > 0) {
      await messageTemplateRepository.deleteByIds(
        toDelete.map((t) => t.id),
        transaction
      );
    }

    const usedNames = new Set<string>();
    for (const item of items) {
      const normalizedName = item.name.trim().toLowerCase();
      if (usedNames.has(normalizedName)) {
        throw AppError.badRequest(`Duplicate template name: ${item.name}`);
      }
      usedNames.add(normalizedName);

      if (item.externalId && existingExternalIds.includes(item.externalId)) {
        const existing = existingTemplates.find(
          (t) => t.externalId === item.externalId
        );
        if (existing) {
          const nameConflict =
            await messageTemplateRepository.existsByNameExcludingId(
              item.name,
              existing.id
            );
          if (nameConflict) {
            throw AppError.badRequest(
              `Template name already exists: ${item.name}`
            );
          }
          await messageTemplateRepository.update(
            existing.id,
            {
              name: item.name,
              htmlContent: item.htmlContent,
            },
            transaction
          );
        }
      } else {
        const existingByName = await messageTemplateRepository.findByName(
          item.name
        );
        if (existingByName) {
          throw AppError.badRequest(
            `Template name already exists: ${item.name}`
          );
        }
        await messageTemplateRepository.create(
          {
            externalId: uuidv4(),
            name: item.name,
            htmlContent: item.htmlContent,
          },
          transaction
        );
      }
    }
  },

  async updateEmailSignature(
    htmlContent: string,
    transaction: import("sequelize").Transaction
  ): Promise<void> {
    if (htmlContent) {
      htmlSanitizer.validate(htmlContent);
    }

    const signature = await emailSignatureRepository.getOrCreate(transaction);
    await emailSignatureRepository.update(
      signature.id,
      htmlContent,
      transaction
    );
  },

  async updateConfigurations(
    items: UpdateConfigurationItemDTO[]
  ): Promise<void> {
    for (const item of items) {
      const configuration = await configurationRepository.findByExternalId(
        item.externalId
      );

      if (!configuration) {
        throw AppError.badRequest(
          `Configuration not found: ${item.externalId}`
        );
      }

      const validCodes = configuration.options.map((opt) => opt.code);
      const invalidCodes = item.selected.filter(
        (code) => !validCodes.includes(code)
      );

      if (invalidCodes.length > 0) {
        throw AppError.badRequest(
          `Configuration ${configuration.code}: invalid codes - ${invalidCodes.join(", ")}`
        );
      }

      await configurationRepository.updateSelected(
        configuration.id,
        item.selected
      );
    }
  },
};
