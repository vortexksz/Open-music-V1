const {
    postAuthenticationPayloadSchema,
    userPayloadSchema,
    PutAuthenticationPayloadSchema,
    DeleteAuthenticationPayloadSchema,
} = require('./schema');

const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
    validateUserPayload: (payload) => {
        const validationResult = userPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },

    validatePostAuthenticationPayload: (payload) => {
        const validationResult = postAuthenticationPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },

    validatePutAuthenticationPayload: (payload) => {
        const validationResult = PutAuthenticationPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },

    validateDeleteAuthenticationPayload: (payload) => {
        const validationResult = DeleteAuthenticationPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = AuthenticationsValidator;