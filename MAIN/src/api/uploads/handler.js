import autoBind from "auto-bind";

class UploadsHandler {
    constructor( storageService, albumsService, validator) {
        this._storageService = storageService;
        this._albumsService = albumsService;
        this._validator = validator;

        autoBind(this);
    }

    async postUploadAlbumCoverHandler(request, h) {
        const { id: albumId } = request.params;
        const { cover } = request.payload;

        this._validator.validateUploadPayload(cover.hapi.headers);

        await this._albumsService.getAlbumById(albumId);
        const filename = await this._storageService.writeFile(cover, cover.hapi);
        const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/uploads/images/${filename}`;

        await this._albumsService.addAlbumCover(albumId, fileLocation);

        const response = h.response({
            status: 'success',
            message: 'Sampul album berhasil diunggah',
            data: {
                coverUrl: fileLocation,
            },
        });
        response.code(201);
        return response;
    }
}

export default UploadsHandler;