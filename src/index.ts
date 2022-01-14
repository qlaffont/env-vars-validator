import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
  coerceTypes: true,
});
addFormats(ajv);

export const validateEnv: (
  validationSchema: object,
  options?: {
    requiredProperties?: string[];
  },
) => void = (validationSchema, options = {}) => {
  const { requiredProperties } = options;

  if (!validationSchema) {
    throw new Error(
      'Impossible to load environment variables validation schema.',
    );
  }

  const schema = {
    type: 'object',
    properties: {
      ...validationSchema,
    },
    required: requiredProperties,
  };

  const validate = ajv.compile(schema);

  if (!validate(process.env)) {
    throw new Error(
      ajv.errorsText(validate.errors, { dataVar: 'process.env' }),
    );
  }
};

enum Environment {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}

export const currentEnv = (
  !!process.env.NODE_ENV && process.env.NODE_ENV !== undefined
    ? process.env.NODE_ENV
    : Environment.DEVELOPMENT
)
  ?.toString()
  ?.toLowerCase()
  ?.trim();
export const isProductionEnv = currentEnv === Environment.PRODUCTION;
export const isDevelopmentEnv = currentEnv === Environment.DEVELOPMENT;
export const isTestEnv = currentEnv === Environment.TEST;
export const isDeployedEnv =
  currentEnv !== Environment.DEVELOPMENT && currentEnv !== Environment.TEST;
