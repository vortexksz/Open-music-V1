const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelAlbum } = require('../../utils/indexAlbum');
const { mapDBToModelSong } = require('../../utils/indexSong');

class AlbumsService {
    constructor(){
        this._pool = new Pool();
    }

    async addAlbum({ name, year }){

        const id = nanoid(16);
        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
            values: [id, name, year], 
        };

        const result = await this._pool.query(query);

        if(!result.rows[0].id){
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;

    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        const album = result.rows.map(mapDBToModelAlbum)[0];

        const songsQuery = {
            text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
            values: [id],
        };

        const songsResult = await this._pool.query(songsQuery);

        const songs = songsResult.rows.map(mapDBToModelSong);

        const formattedAlbum = {
            id: album.id,
            name: album.name,
            year: album.year,
            songs: songs,
        };
    }

    async editAlbumById(id, { name, year }) {
        const updatedAt = new Date();

        const query = {
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING *',
            values: [name, year, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui Album. Id tidak ditemukan');
        }

        return mapDBToModelAlbum(result.rows[0]);
    }


    async deleteAlbumById(id){
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
        }
    }

}

module.exports = AlbumsService;
