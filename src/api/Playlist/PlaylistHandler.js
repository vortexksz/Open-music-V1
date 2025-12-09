const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class PlaylistHandler {
    constructor(playlistService, playlistsValidator, songService) {
        this._playlistService = playlistService;
        this._playlistsValidator = playlistsValidator;
        this._songService = songService;

        autoBind(this);
    }

    async postPlaylistHandler(request, h) {
        try {
            this._playlistsValidator.validatePostPlaylistPayload(request.payload);
            const { name } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            const playlistId = await this._playlistService.addPlaylist({ name, owner: credentialId });

            const response = h.response({
                status: 'success',
                data: {
                    playlistId,
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

    async getPlaylistsHandler(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const playlists = await this._playlistService.getPlaylists(credentialId);

            const response = h.response({
                status: 'success',
                data: {
                    playlists,
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

    async postSongToPlaylistHandler(request, h) {
        try {
            this._playlistsValidator.validatePlaylistSongPayload(request.payload);
            const { id } = request.params;
            const { songId } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            await this._playlistService.verifyPlaylistAccess(id, credentialId);

            await this._songService.getSongById(songId);
    
            await this._playlistService.addSongToPlaylist(id, songId);

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan ke playlist',
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

    async getSongsFromPlaylistHandler(request, h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._playlistService.verifyPlaylistAccess(id, credentialId);
            const songs = await this._playlistService.getSongsFromPlaylist(id);

            const response = h.response({
                status: 'success',
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

    async deleteSongFromPlaylistHandler(request, h) {
        try {
            this._playlistsValidator.validatePlaylistSongPayload(request.payload);
            const { id } = request.params;
            const { songId } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            await this._playlistService.verifyPlaylistAccess(id, credentialId);

            await this._playlistService.deleteSongFromPlaylist(id, songId);

            return {
                status: 'success',
                message: 'Lagu berhasil dihapus dari playlist',
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

module.exports = PlaylistHandler;