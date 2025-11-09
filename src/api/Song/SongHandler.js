class SongHanlder{
    constructor (service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongHandler = this.getSongHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongHandler (request, h){
        
        try {
            this._validator.validateSongPayload(request.payload);
            const { title, year, genre, performer, duration, albumId } = request.payload;

            const noteId = await this._service.addSong({ title, year, genre, performer, duration, albumId });

            const response = h.response({

                status: 'success',
                message: 'Menambahkan lagu',
                data: {
                    songId: "album_id",
                },
            });

            response.code(201);
            return response;

        } catch (error) {
            if(error instanceof )
        }

    }

    async getSongHandler (requset, h){

    }

    async getSongByIdHandler (request, h){

    }

    async putSongByIdHandler (request, h){

    }

    async deleteSongByIdHandler (request, h){

    }
}