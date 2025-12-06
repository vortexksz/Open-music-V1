const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistPayloadSchema, PlaylistPayloadSongsSchema } = require('./PlaylistSchema');

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

module.exports = PlaylistsValidator;