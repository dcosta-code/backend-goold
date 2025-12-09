import Joi from "joi";

const tagItemSchema = Joi.object({
  externalId: Joi.string().uuid().allow(null),
  name: Joi.string().min(1).max(100).required(),
  backgroundColor: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .required()
    .messages({
      "string.pattern.base":
        "backgroundColor must be a valid hex color (e.g., #FF0000)",
    }),
  textColor: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .required()
    .messages({
      "string.pattern.base":
        "textColor must be a valid hex color (e.g., #FFFFFF)",
    }),
});

const messageTemplateItemSchema = Joi.object({
  externalId: Joi.string().uuid().allow(null),
  name: Joi.string().min(1).max(100).required(),
  htmlContent: Joi.string().min(1).max(5242880).required(),
});

const emailSignatureSchema = Joi.object({
  htmlContent: Joi.string().max(5242880).allow("").required(),
});

const configurationItemSchema = Joi.object({
  externalId: Joi.string().uuid().required(),
  selected: Joi.array().items(Joi.string().max(50)).required(),
});

export const updateAllSettingsSchema = Joi.object({
  tags: Joi.array().items(tagItemSchema),
  messageTemplates: Joi.array().items(messageTemplateItemSchema),
  emailSignature: emailSignatureSchema,
  configurations: Joi.array().items(configurationItemSchema),
})
  .min(1)
  .messages({
    "object.min": "At least one settings category must be provided",
  });
