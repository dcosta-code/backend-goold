import Joi from "joi";

export const loginEmployeeSchema = Joi.object({
  email: Joi.string().email().max(255).required().messages({
    "string.email": "Invalid email format",
    "string.max": "Email must be at most 255 characters",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).max(255).required().messages({
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must be at most 255 characters",
    "any.required": "Password is required",
  }),
});

export const refreshEmployeeTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token is required",
  }),
});
