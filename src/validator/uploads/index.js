import InvariantError from '../../exceptions/InvariantError.js';
import { UploadsSchema } from './schema.js';

const UploadsValidator = {
    validateUploadPayload: (payload) => {
        const validationResult = UploadsSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
};

export default UploadsValidator;