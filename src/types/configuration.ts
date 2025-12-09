export interface ConfigurationOption {
  code: string;
  display: string;
}

export interface ConfigurationResponse {
  externalId: string;
  code: string;
  display: string;
  options: ConfigurationOption[];
  selected: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateConfigurationItemDTO {
  externalId: string;
  selected: string[];
}

export interface BulkUpdateConfigurationsDTO {
  configurations: UpdateConfigurationItemDTO[];
}
