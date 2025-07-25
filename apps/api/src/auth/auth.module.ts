import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import {
  DatabaseModule,
  LoggerModule,
  UsersDocument,
  UsersRepository,
  UsersSchema,
  UsersService,
  TokenDocument,
  TokenSchema,
  TokenRepository,
  ApiKeyDocument,
  ApiKeySchema,
  ApiKeyRepository,
  ApiKeyService,
  ServiceRegistryService,
  SecretsService,
  RoleValidationService,
} from '@bitsacco/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './tokens/token.service';
import { AuthMetricsService } from './metrics/auth.metrics';
import { TokenMetricsService } from './tokens/token.metrics';
import { RateLimitService } from './rate-limit/rate-limit.service';
import { ApiKeyController } from './apikeys/apikey.controller';
import { ApiKeyRotationController } from './apikeys/apikey-rotation.controller';
import { ApiKeyMetricsService } from './apikeys/apikey.metrics';
import { ApiKeyRotationService } from './apikeys/apikey-rotation.service';
import { SmsModule } from '../sms/sms.module';
import { JwtConfigModule } from '../shared/jwt-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        AUTH_JWT_SECRET: Joi.string()
          .min(32)
          .required()
          .description(
            'JWT secret must be at least 32 characters for security',
          ),
        AUTH_JWT_EXPIRATION: Joi.string().required(),
        AUTH_JWT_AUD: Joi.string().required(),
        AUTH_JWT_ISS: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION_DAYS: Joi.number().default(7),
        SALT_ROUNDS: Joi.number().required(),
        SMS_AT_API_KEY: Joi.string().required(),
        SMS_AT_USERNAME: Joi.string().required(),
        SMS_AT_FROM: Joi.string().required(),
        SMS_AT_KEYWORD: Joi.string().required(),
      }),
    }),
    SmsModule,
    JwtConfigModule.forRoot({
      secretKey: 'AUTH_JWT_SECRET',
      expirationKey: 'AUTH_JWT_EXPIRATION',
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UsersDocument.name, schema: UsersSchema },
      { name: TokenDocument.name, schema: TokenSchema },
      { name: ApiKeyDocument.name, schema: ApiKeySchema },
    ]),
    LoggerModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  controllers: [AuthController, ApiKeyController, ApiKeyRotationController],
  providers: [
    AuthMetricsService,
    TokenMetricsService,
    ApiKeyMetricsService,
    AuthService,
    UsersRepository,
    UsersService,
    ConfigService,
    TokenRepository,
    TokenService,
    RateLimitService,
    ApiKeyRepository,
    ApiKeyService,
    SecretsService,
    ServiceRegistryService,
    ApiKeyRotationService,
    RoleValidationService,
  ],
})
export class AuthModule {}
