import Joi from 'joi';

const exportPlaylistPayloadSchema = Joi.object({
    targetEmail: Joi.string().email().required(),
});

export { exportPlaylistPayloadSchema };