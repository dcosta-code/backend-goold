import { configurationRepository } from "../repositories/configurationRepository";
import { AppError } from "../utils/AppError";
import {
  BulkUpdateConfigurationsDTO,
  ConfigurationResponse,
} from "../types/configuration";

export const bulkUpdateConfigurationsService = {
  async execute(data: BulkUpdateConfigurationsDTO): Promise<ConfigurationResponse[]> {
    const results: ConfigurationResponse[] = [];
    const errors: string[] = [];

    for (const item of data.configurations) {
      const configuration = await configurationRepository.findByExternalId(
        item.externalId
      );

      if (!configuration) {
        errors.push(`Configuration ${item.externalId} not found`);
        continue;
      }

      const validCodes = configuration.options.map((opt) => opt.code);
      const invalidCodes = item.selected.filter(
        (code) => !validCodes.includes(code)
      );

      if (invalidCodes.length > 0) {
        errors.push(
          `Configuration ${configuration.code}: invalid codes - ${invalidCodes.join(", ")}`
        );
        continue;
      }

      await configurationRepository.updateSelected(
        configuration.id,
        item.selected
      );

      const updated = await configurationRepository.findByExternalId(
        item.externalId
      );

      if (updated) {
        results.push({
          externalId: updated.externalId,
          code: updated.code,
          display: updated.display,
          options: updated.options,
          selected: updated.selected,
          isActive: updated.isActive,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        });
      }
    }

    if (errors.length > 0 && results.length === 0) {
      throw AppError.badRequest(errors.join("; "));
    }

    return results;
  },
};
