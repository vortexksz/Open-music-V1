const Joi = require('joi');

const postAuthenticationPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

const userPayloadSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    fullname: Joi.string().required(),
});

const PutAuthenticationPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

const DeleteAuthenticationPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

module.exports = {
    postAuthenticationPayloadSchema,
    userPayloadSchema,
    PutAuthenticationPayloadSchema,
    DeleteAuthenticationPayloadSchema,
};