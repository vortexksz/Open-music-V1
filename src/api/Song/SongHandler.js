const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class SongHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postSongHandler (request, h){
        try {
            this._validator.validateSongPayload(request.payload);
            const { title, year, genre, performer, duration, albumId } = request.payload;

            const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId });

            const response = h.response({
                status: 'success',
                message: 'Menambahkan lagu',
                data: {
                    songId,
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

    async getSongHandler(request, h) {
        try {
            const songs = await this._service.getSongs(request.query);

            const response = h.response({
                status: 'success',
                message: 'Mendapatkan seluruh lagu',
                data: {
                    songs,
                },
            });

            response.code(200);
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

    async getSongByIdHandler (request, h){
        try {
            const { id } = request.params;
            const song = await this._service.getSongById(id);
            const response = h.response({
                status: 'success',
                message: 'Mendapatkan Lagu berdasarkan id',
                data: {
                    song,
                },
            });

            response.code(200);
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

    async putSongByIdHandler (request, h){
        try {
            this._validator.validateSongPayload(request.payload);
            const { id } = request.params;

            await this._service.editSongById(id, request.payload);

            const response = h.response({
                status: 'success',
                message: 'Mengubah lagu berdasarkan id',
                data: {
                    songId: id,
                },
            });

            response.code(200);
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

    async deleteSongByIdHandler (request, h){
        try {
            const { id } = request.params;

            await this._service.deleteSongById(id);

            const response = h.response({
                status: 'success',
                message: 'Menghapus lagu berdasarkan id',
            });

            response.code(200);
            return response;
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(error.statusCode || 500);
            return response;
        }
    }
}

module.exports = SongHandler;