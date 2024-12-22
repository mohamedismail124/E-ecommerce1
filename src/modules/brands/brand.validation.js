import Joi from "joi";

export const createBrandSchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
});