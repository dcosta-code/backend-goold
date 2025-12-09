import { tagRepository } from "../repositories/tagRepository";
import { messageTemplateRepository } from "../repositories/messageTemplateRepository";
import { emailSignatureRepository } from "../repositories/emailSignatureRepository";
import { configurationRepository } from "../repositories/configurationRepository";
import { AllSettingsResponse } from "../types/settings";

export const getAllSettingsService = {
  async execute(): Promise<AllSettingsResponse> {
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
        ranking: config.ranking,
        isActive: config.isActive,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
      })),
    };
  },
};
