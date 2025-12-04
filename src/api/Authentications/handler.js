const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class AuthenticationsHandler {
    constructor(authenticationsService, usersService, tokenManager, validator) {
        this._authenticationsService = authenticationsService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        autoBind(this);
    }

    async postUserHandler(request, h) {
        try {
            if (this._validator && this._validator.validateUserPayload) {
                this._validator.validateUserPayload(request.payload);
            }

            const { username, password, fullname } = request.payload;
            const userId = await this._usersService.addUser({ username, password, fullname });

            const response = h.response({
                status: 'success',
                message: 'Menambahkan pengguna',
                data: {
                    userId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async postAuthenticationHandler(request, h) {
        try {
            if (this._validator && this._validator.validatePostAuthenticationPayload) {
                this._validator.validatePostAuthenticationPayload(request.payload);
            }

            const { username, password } = request.payload;
            const id = await this._usersService.verifyUserCredential(username, password);

            const accessToken = this._tokenManager.generateAccessToken({ id });
            const refreshToken = this._tokenManager.generateRefreshToken({ id });

            await this._authenticationsService.addToken(refreshToken);

            const response = h.response({
                status: 'success',
                data: {
                    accessToken,
                    refreshToken,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async putAuthenticationHandler(request, h) {
        try {
            if (this._validator && this._validator.validatePutAuthenticationPayload) {
                this._validator.validatePutAuthenticationPayload(request.payload);
            }

            const { refreshToken } = request.payload;

            await this._authenticationsService.verifyToken(refreshToken);
            const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

            const accessToken = this._tokenManager.generateAccessToken({ id });

            return {
                status: 'success',
                data: {
                    accessToken,
                },
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deleteAuthenticationHandler(request, h) {
        try {
            if (this._validator && this._validator.validateDeleteAuthenticationPayload) {
                this._validator.validateDeleteAuthenticationPayload(request.payload);
            }

            const { refreshToken } = request.payload;
            await this._authenticationsService.verifyToken(refreshToken);
            await this._authenticationsService.deleteToken(refreshToken);

            return {
                status: 'success',
                message: 'Berhasil menghapus autentikasi',
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = AuthenticationsHandler;