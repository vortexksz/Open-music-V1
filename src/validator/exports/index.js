import InvariantError from '../../exceptions/InvariantError.js';
import { exportPlaylistPayloadSchema } from './schema.js';

const ExportsValidator = {
    validateExportPlaylistPayload: (payload) => {
        const validationResult = exportPlaylistPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

export default ExportsValidator;

