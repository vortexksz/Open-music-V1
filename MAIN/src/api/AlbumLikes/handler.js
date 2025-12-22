import autoBind from "auto-bind";

class AlbumLikesHandler {
    constructor(service, albumService, validator) {
        this._service = service;
        this._albumService = albumService;
        this._validator = validator;

        autoBind(this);
    }

    async postAlbumLikeHandler(request, h) {
        const { id: albumId } = request.params;
        const { id: userId } = request.auth.credentials;

        await this._albumService.getAlbumById(albumId, userId);

        const message = await this._service.addAlbumLike(albumId, userId);

        const response = h.response({
            status: 'success',
            message,
        });
        response.code(201);
        return response;
    }

    async deleteAlbumLikeHandler(request, h) {
        const { id: albumId } = request.params;
        const { id: userId } = request.auth.credentials;

        await this._albumService.getAlbumById(albumId, userId);

        const message = await this._service.deleteAlbumLike(albumId, userId);

        return {
            status: 'success',
            message,
        };
    }

    async getAlbumLikesHandler(request, h) {
        const { id: albumId } = request.params;

        await this._albumService.getAlbumById(albumId);

        const { likes, isCache } =  await this._service.getAlbumLikes(albumId);
        const response = h.response({
            status: 'success',
            data: {
                likes,
            },
        });

        if (isCache) {
            response.header('X-Data-Source', 'cache');
        }

        return response;
    }
}

export default AlbumLikesHandler;