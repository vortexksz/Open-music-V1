const ClientError = require('../../exceptions/ClientError');

class PlaylistHandler {
    constructor(playlistService, playlistsValidator) {
        this._playlistService = playlistService;
        this._playlistsValidator = playlistsValidator;
    }

    async postPlaylistHandler(request, h) {
        try {
            this._playlistsValidator.validatePlaylistPayload(request.payload);
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
        }
    }

    async getPlaylistsHandler(request) {
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
        }
    }

    async deleteSongFromPlaylistHandler(request) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._service.verifyPlaylistOwner(id, credentialId);
            await this._.deletePlaylist(id, credentialId);

            return {
                status: 'success',
                message: 'Playlist berhasil dihapus',
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
        }

    }

    async postSongToPlaylistHandler(request, h) {
        try {
            this._playlistsValidator.validatePlaylistSongPayload(request.payload);
            const { id } = request.params;
            const { songId } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            await this._playlistService.verifyPlaylistAccess(id, credentialId);
    
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
        }catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
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
        }
    }

}

module.exports = PlaylistHandler;