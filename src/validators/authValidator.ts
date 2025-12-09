import Joi from "joi";

export const registerCustomerSchema = Joi.object({
  cpf: Joi.string()
    .length(11)
    .pattern(/^\d{11}$/)
    .required()
    .messages({
      "string.length": "CPF must be exactly 11 digits",
      "string.pattern.base": "CPF must contain only numbers",
      "any.required": "CPF is required",
    }),
  password: Joi.string()
    .length(6)
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.length": "Password must be exactly 6 digits",
      "string.pattern.base": "Password must contain only numbers",
      "any.required": "Password is required",
    }),
  fullName: Joi.string().min(2).max(255).required().messages({
    "string.min": "Full name must be at least 2 characters",
    "string.max": "Full name must be at most 255 characters",
    "any.required": "Full name is required",
  }),
  email: Joi.string().email().max(255).required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  phone: Joi.string()
    .length(11)
    .pattern(/^\d{11}$/)
    .required()
    .messages({
      "string.length": "Phone must be exactly 11 digits (area code + number)",
      "string.pattern.base": "Phone must contain only numbers",
      "any.required": "Phone is required",
    }),
});

export const loginSchema = Joi.object({
  cpf: Joi.string()
    .length(11)
    .pattern(/^\d{11}$/)
    .required()
    .messages({
      "string.length": "CPF must be exactly 11 digits",
      "string.pattern.base": "CPF must contain only numbers",
      "any.required": "CPF is required",
    }),
  password: Joi.string()
    .length(6)
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.length": "Password must be exactly 6 digits",
      "string.pattern.base": "Password must contain only numbers",
      "any.required": "Password is required",
    }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token is required",
  }),
});
