const InvariantError = require('../../exceptions/InvariantError');
const { UserPayloadSchema } = require('./UserSchema');

const UsersValidator = {
    validateUserPayload: (payload) => {
        const validationResult = UserPayloadSchema.validate(payload);

        if(validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = UsersValidator;