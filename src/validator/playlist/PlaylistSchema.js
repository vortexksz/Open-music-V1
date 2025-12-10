import Joi from 'joi';

export const PlaylistPayloadSchema = Joi.object({
    name: Joi.string().required(),
    
});

export const PlaylistPayloadSongsSchema = Joi.object({
    songId: Joi.string().required(),
})

