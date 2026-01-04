const Joi = require("joi");

const schema = Joi.object({
  PORT: Joi.number().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
}).unknown();

const { error } = schema.validate(process.env);
if (error) {
  throw new Error(`ENV VALIDATION ERROR: ${error.message}`);
}
