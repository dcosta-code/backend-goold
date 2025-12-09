import Joi from "joi";

const configurationItemSchema = Joi.object({
  externalId: Joi.string().uuid().required().messages({
    "string.guid": "External ID must be a valid UUID",
    "any.required": "External ID is required",
  }),
  selected: Joi.array().items(Joi.string().max(50)).required().messages({
    "array.base": "Selected must be an array",
    "any.required": "Selected is required",
  }),
});

export const bulkUpdateConfigurationsSchema = Joi.object({
  configurations: Joi.array()
    .items(configurationItemSchema)
    .min(1)
    .required()
    .messages({
      "array.base": "Configurations must be an array",
      "array.min": "At least one configuration must be provided",
      "any.required": "Configurations is required",
    }),
});
