import Joi from 'joi';

export const UploadsSchema = Joi.object({
    'content-type': Joi.string().valid('image/jpeg', 'image/png').required(),
}).unknown();