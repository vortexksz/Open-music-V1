import autoBind from 'auto-bind';
import ClientError from '../../exceptions/ClientError.js';

class ExportPlaylistHandler {
    constructor(exportService, playlistsService, validator) {
        this._exportService = exportService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        autoBind(this);
    }

    async exportPlaylistHandler(request, h) {
        try {
            this._validator.validateExportPlaylistPayload(request.payload);
            const { playlistId } = request.params;
            const { targetEmail } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
            const message = {
                playlistId,
                targetEmail,
            };
            await this._exportService.sendMessage('export:playlists', JSON.stringify(message));

            const response = h.response({
                status: 'success',
                message: 'Permintaan Anda sedang kami proses',
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
                message: error.message || 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

export default ExportPlaylistHandler;