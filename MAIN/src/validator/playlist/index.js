import InvariantError from '../../exceptions/InvariantError.js';
import {PlaylistPayloadSchema, PlaylistPayloadSongsSchema} from './PlaylistSchema.js';

const PlaylistsValidator = {
    validatePostPlaylistPayload: (payload) => {
        const validationResult = PlaylistPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },

    validatePlaylistSongPayload: (payload) => {
        const validationResult = PlaylistPayloadSongsSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

export default PlaylistsValidator;