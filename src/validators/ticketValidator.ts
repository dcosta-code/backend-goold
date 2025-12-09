import Joi from "joi";

export const assignTicketSchema = Joi.object({
  employeeExternalId: Joi.string().uuid().required().messages({
    "string.guid": "Invalid employee ID format",
    "any.required": "Employee ID is required",
  }),
});

export const updateTicketStatusSchema = Joi.object({
  statusExternalId: Joi.string().uuid().required().messages({
    "string.guid": "Invalid status ID format",
    "any.required": "Status ID is required",
  }),
});

export const listTicketsQuerySchema = Joi.object({
  status: Joi.string().valid("open", "in_progress", "closed").optional(),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
});
