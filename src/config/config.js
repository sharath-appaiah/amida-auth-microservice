const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.env.test' });
} else {
    dotenv.config();
}

// define validation for all the env vars
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow(['development', 'production', 'test', 'provision'])
        .default('production'),
    LOG_LEVEL: Joi.string()
        .default('info'),
    ALWAYS_INCLUDE_ERROR_STACKS: Joi.bool()
        .default(false),
    AUTH_SERVICE_PORT: Joi.number()
        .default(4000),
    AUTH_SERVICE_PUBLIC_REGISTRATION: Joi.bool()
        .default(false),
    AUTH_SERVICE_REGISTRAR_SCOPES: Joi.array()
        .items(Joi.string())
        .when('AUTH_SERVICE_PUBLIC_REGISTRATION', {
            is: false,
            then: Joi.required(),
        }),
    AUTH_SERVICE_JWT_MODE: Joi.string().allow(['rsa', 'hmac']).default('hmac')
        .description('Signing algorithm for JWT'),
    JWT_SECRET: Joi.string()
        .description('JWT Secret required to sign'),
    AUTH_SERVICE_JWT_PRIVATE_KEY_PATH: Joi.string()
        .description('Absolute or relative path to RSA private key'),
    AUTH_SERVICE_JWT_PUBLIC_KEY_PATH: Joi.string()
        .description('Absolute or relative path to RSA public key'),
    AUTH_SERVICE_JWT_TTL: Joi.number()
        .default(3600),
    AUTH_SERVICE_REFRESH_TOKEN_ENABLED: Joi.bool()
        .default(false),
    AUTH_SERVICE_REFRESH_TOKEN_MULTIPLE_DEVICES: Joi.bool()
        .default(false),
    AUTH_SERVICE_REQUIRE_ACCOUNT_VERIFICATION: Joi.bool()
        .default(false),
    AUTH_SERVICE_REQUIRE_SECURE_ACCOUNT_VERIFICATION: Joi.bool()
        .default(false),
    AUTH_SERVICE_SEED_ADMIN_USERNAME: Joi.alternatives([
        Joi.string()
            .email({ minDomainAtoms: 2 })
            .required()
            .default('admin@example.com')
            .description('User name of the Seed Admin user. Used in the seeding process only.'),
        Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .default('admin')
            .description('User name of the Seed Admin user. Used in the seeding process only.')]),
    AUTH_SERVICE_SEED_ADMIN_EMAIL: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required()
        .default('admin@example.com')
        .description('Email of the Seed Admin user. Used in the seeding process only.'),
    AUTH_SERVICE_SEED_ADMIN_PASSWORD: Joi.string()
        .min(3)
        .max(512)
        .description('Password of the Seed Admin user. Used in the seeding process only. Optional, and if not specified, a password will get auto-generated and printed to stdout.'),
    AUTH_SERVICE_PG_DB: Joi.string().required()
        .description('Postgres database name'),
    AUTH_SERVICE_PG_PORT: Joi.number()
        .default(5432),
    AUTH_SERVICE_PG_HOST: Joi.string(),
    AUTH_SERVICE_PG_USER: Joi.string().required()
        .description('Postgres username'),
    AUTH_SERVICE_PG_PASSWORD: Joi.string().allow('')
        .description('Postgres password'),
    AUTH_SERVICE_PG_SSL_ENABLED: Joi.bool()
        .default(false)
        .description('Enable SSL connection to PostgreSQL'),
    AUTH_SERVICE_PG_CA_CERT: Joi.string()
        .description('SSL certificate CA. This string must be the certificate itself, not a filename.'),
    AUTH_SERVICE_MAILER_EMAIL_ID: Joi.string().allow(''),
    AUTH_SERVICE_MAILER_PASSWORD: Joi.string().allow(''),
    AUTH_SERVICE_MAILER_FROM_EMAIL_ADDRESS: Joi.string().allow(''),
    AUTH_SERVICE_MAILER_SERVICE_PROVIDER: Joi.any().valid(
        '126',
        '163',
        '1und1',
        'AOL',
        'DebugMail',
        'DynectEmail',
        'FastMail',
        'GandiMail',
        'Gmail',
        'Godaddy',
        'GodaddyAsia',
        'GodaddyEurope',
        'hot.ee',
        'Hotmail',
        'iCloud',
        'mail.ee',
        'Maildev',
        'Mailgun',
        'Mailjet',
        'Mailosaur',
        'Mandrill',
        'Naver',
        'OpenMailBox',
        'Outlook365',
        'Postmark',
        'QQ',
        'QQex',
        'SendCloud',
        'SendGrid',
        'SendinBlue',
        'SendPulse',
        'SES',
        'SES-US-EAST-1',
        'SES-US-WEST-2',
        'SES-EU-WEST-1',
        'Sparkpost',
        'Yahoo',
        'Yandex',
        'Zoho',
        'qiye.aliyun'
    ).allow(''),
    FACEBOOK_CLIENT_ID: Joi.string(),
    FACEBOOK_CLIENT_SECRET: Joi.string(),
    FACEBOOK_CALLBACK_URL: Joi.string(),
}).unknown()
    .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    logLevel: envVars.LOG_LEVEL,
    alwaysIncludeErrorStacks: envVars.ALWAYS_INCLUDE_ERROR_STACKS,
    port: envVars.AUTH_SERVICE_PORT,
    publicRegistration: envVars.AUTH_SERVICE_PUBLIC_REGISTRATION,
    registrarScopes: envVars.AUTH_SERVICE_REGISTRAR_SCOPES,
    jwtMode: envVars.AUTH_SERVICE_JWT_MODE,
    jwtSecret: envVars.JWT_SECRET,
    jwtPrivateKeyPath: envVars.AUTH_SERVICE_JWT_PRIVATE_KEY_PATH,
    jwtPublicKeyPath: envVars.AUTH_SERVICE_JWT_PUBLIC_KEY_PATH,
    jwtExpiresIn: envVars.AUTH_SERVICE_JWT_TTL,
    requireSecureAccountVerification: envVars.AUTH_SERVICE_REQUIRE_SECURE_ACCOUNT_VERIFICATION,
    requireAccountVerification: envVars.AUTH_SERVICE_REQUIRE_ACCOUNT_VERIFICATION,
    refreshToken: {
        enabled: envVars.AUTH_SERVICE_REFRESH_TOKEN_ENABLED,
        multipleDevices: envVars.AUTH_SERVICE_REFRESH_TOKEN_MULTIPLE_DEVICES,
    },
    postgres: {
        db: envVars.AUTH_SERVICE_PG_DB,
        port: envVars.AUTH_SERVICE_PG_PORT,
        host: envVars.AUTH_SERVICE_PG_HOST,
        user: envVars.AUTH_SERVICE_PG_USER,
        password: envVars.AUTH_SERVICE_PG_PASSWORD,
        sslEnabled: envVars.AUTH_SERVICE_PG_SSL_ENABLED,
        sslCaCert: envVars.AUTH_SERVICE_PG_CA_CERT,
    },
    mailer: {
        user: envVars.AUTH_SERVICE_MAILER_EMAIL_ID,
        password: envVars.AUTH_SERVICE_MAILER_PASSWORD,
        fromAddress: envVars.AUTH_SERVICE_MAILER_FROM_EMAIL_ADDRESS,
        service: envVars.AUTH_SERVICE_MAILER_SERVICE_PROVIDER,
    },
    facebook: {
        clientId: envVars.FACEBOOK_CLIENT_ID,
        clientSecret: envVars.FACEBOOK_CLIENT_SECRET,
        callbackUrl: envVars.FACEBOOK_CALLBACK_URL,
    },
    adminUser: {
        username: envVars.AUTH_SERVICE_SEED_ADMIN_USERNAME,
        email: envVars.AUTH_SERVICE_SEED_ADMIN_EMAIL,
        password: envVars.AUTH_SERVICE_SEED_ADMIN_PASSWORD,
        scopes: ['admin'],
    },
};

module.exports = config;
