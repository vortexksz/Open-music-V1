import Joi from 'joi';

export const postAuthenticationPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

export const userPayloadSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    fullname: Joi.string().required(),
});

export const PutAuthenticationPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

export const DeleteAuthenticationPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

