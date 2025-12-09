import Joi from "joi";

export const createEmployeeSchema = Joi.object({
  email: Joi.string().email().max(255).required().messages({
    "string.email": "Invalid email format",
    "string.max": "Email must be at most 255 characters",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .max(255)
    .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must be at most 255 characters",
      "string.pattern.base": "Password must contain letters and numbers",
      "any.required": "Password is required",
    }),
  fullName: Joi.string().min(2).max(255).required().messages({
    "string.min": "Full name must be at least 2 characters",
    "string.max": "Full name must be at most 255 characters",
    "any.required": "Full name is required",
  }),
  roles: Joi.array()
    .items(Joi.string().trim().min(1))
    .min(1)
    .required()
    .messages({
      "array.min": "At least one role is required",
      "any.required": "Roles are required",
    }),
  permissions: Joi.array()
    .items(Joi.string().trim().min(1))
    .messages({
      "array.base": "Permissions must be an array of strings",
    }),
});

export const updateEmployeeSchema = Joi.object({
  email: Joi.string().email().max(255).messages({
    "string.email": "Invalid email format",
    "string.max": "Email must be at most 255 characters",
  }),
  password: Joi.string()
    .min(8)
    .max(255)
    .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must be at most 255 characters",
      "string.pattern.base": "Password must contain letters and numbers",
    }),
  fullName: Joi.string().min(2).max(255).messages({
    "string.min": "Full name must be at least 2 characters",
    "string.max": "Full name must be at most 255 characters",
  }),
  isActive: Joi.boolean(),
  roles: Joi.array()
    .items(Joi.string().trim().min(1))
    .min(1)
    .messages({
      "array.min": "At least one role is required",
    }),
  permissions: Joi.array()
    .items(Joi.string().trim().min(1))
    .messages({
      "array.base": "Permissions must be an array of strings",
    }),
}).min(1).messages({
  "object.min": "At least one field must be provided",
});
