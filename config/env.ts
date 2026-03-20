import Joi from "joi";

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),

  GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
  GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),

  DRIVE_DATA_FILE_NAME: Joi.string().default("Linea_Data"),

  NEXTAUTH_URL: Joi.string()
    .required()
    .description("Required for redirect callback"),
  NEXTAUTH_SECRET: Joi.string()
    .required()
    .description("Required for session encryption"),
})
  .unknown()
  .required();

const { error, value: envVars } = envSchema.validate(process.env, {
  abortEarly: false, // Show all errors at once, not just the first one
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
  nodeEnv: envVars.NODE_ENV,
  nextAuth: {
    secret: envVars.NEXTAUTH_SECRET,
    url: envVars.NEXTAUTH_URL,
  },
  google: {
    clientId: envVars.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: envVars.GOOGLE_AUTH_CLIENT_SECRET,
  },
  driveFileName: envVars.DRIVE_DATA_FILE_NAME,
};
