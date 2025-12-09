import Joi from "joi";

export const updateCustomerProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(255).messages({
    "string.min": "Full name must be at least 2 characters",
    "string.max": "Full name must be at most 255 characters",
  }),
  email: Joi.string().email().max(255).messages({
    "string.email": "Invalid email format",
    "string.max": "Email must be at most 255 characters",
  }),
  phone: Joi.string()
    .length(11)
    .pattern(/^\d{11}$/)
    .messages({
      "string.length": "Phone must be exactly 11 digits (area code + number)",
      "string.pattern.base": "Phone must contain only numbers",
    }),
  password: Joi.string()
    .length(6)
    .pattern(/^\d{6}$/)
    .messages({
      "string.length": "Password must be exactly 6 digits",
      "string.pattern.base": "Password must contain only numbers",
    }),
}).min(1).messages({
  "object.min": "At least one field must be provided",
});
