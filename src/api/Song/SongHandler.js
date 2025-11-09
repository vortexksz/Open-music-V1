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
            if(error instanceof ClientError) {
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

    async getSongHandler (requset, h){
        try {
            this._validator.validateSongsPayload(request.payload);
            const songs = await this._service.getSongs({ title, year, genre, performer, duration, albumId });

            const response = h.response({

                status: 'success',
                message: 'Mendapatkan seluruh lagu',
                data{
                    songs: songs,
                },
            });
            
            response.code(200);
            return response;

        } catch (error) {

        }


    }

    async getSongByIdHandler (request, h){
        try{
            const { id } = request.params;
            const song = await this._service.getSongByIdHandler(id);
            const response = h.response({
                status: 'success',
                message: 'Mendapatkan Lagu berdasarkan id'
                data{
                    song : song,
                },
            });
            response.code(200);
            return response;
        }
    }

    async putSongByIdHandler (request, h){
        try {
            this._validateSongsPayload(request.payload);
            const { id } = request.params;

            await this._service.editSongById(id, request.payload);

            const response = h.response({
                status: 'success',
                message: 'Mengubah lagu berdasarkan id'
                data{
                    song,
                },
            });
            response.code(200);
            return response;
        }

    }

    async deleteSongByIdHandler (request, h){

        try {
            const { id } = resquest.params;

            await this._service.deleteSongById(id)

            return {
                status: 'success',
                message: 'Menghapus lagu berdasarkan id',
            }
        } catch (error) {
            if (error )
        } 

    }
}