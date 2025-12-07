import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvValidationSchema } from './env-validation.schema';

export function validateEnv(
  config: Record<string, unknown>,
): EnvValidationSchema {
  const validatedConfig = plainToInstance(EnvValidationSchema, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `❌ Invalid environment variables:\n${errors.map((e) => e.toString()).join('\n')}`,
    );
  }

  return validatedConfig;
}
