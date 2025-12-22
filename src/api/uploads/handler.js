import autoBind from "auto-bind";

class UploadsHandler {
    constructor(albumsService, storageService, validator) {
        this._albumsService = albumsService;
        this._storageService = storageService;
        this._validator = validator;

        autoBind(this);
    }

    async postUploadAlbumCoverHandler(request, h) {
        const { id: albumId } = request.params;
        const { cover } = request.payload;

        this._validator.validateUploadpayload(cover.hapi.headers);

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