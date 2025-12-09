import Joi from "joi";

export const forgotPasswordSchema = Joi.object({
  cpf: Joi.string()
    .length(11)
    .pattern(/^\d{11}$/)
    .required()
    .messages({
      "string.length": "CPF must be exactly 11 digits",
      "string.pattern.base": "CPF must contain only numbers",
      "any.required": "CPF is required",
    }),
});

export const verifyCodeSchema = Joi.object({
  cpf: Joi.string()
    .length(11)
    .pattern(/^\d{11}$/)
    .required()
    .messages({
      "string.length": "CPF must be exactly 11 digits",
      "string.pattern.base": "CPF must contain only numbers",
      "any.required": "CPF is required",
    }),
  code: Joi.string()
    .length(5)
    .pattern(/^\d{5}$/)
    .required()
    .messages({
      "string.length": "Code must be exactly 5 digits",
      "string.pattern.base": "Code must contain only numbers",
      "any.required": "Code is required",
    }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().length(64).required().messages({
    "string.length": "Invalid token",
    "any.required": "Token is required",
  }),
  newPassword: Joi.string()
    .length(6)
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.length": "Password must be exactly 6 digits",
      "string.pattern.base": "Password must contain only numbers",
      "any.required": "New password is required",
    }),
});
