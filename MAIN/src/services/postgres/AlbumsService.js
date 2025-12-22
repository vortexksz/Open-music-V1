import {Pool} from 'pg';
import {nanoid} from 'nanoid';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import {mapDBToModelAlbum} from '../../utils/indexAlbum.js';
import {mapDBToModelSong} from '../../utils/indexSong.js';
import fs from 'fs';
import path from 'path';

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

    async addAlbumCover(id, coverUrl) {
        const oldCoverQuery = {
            text: 'SELECT cover_url FROM albums WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(oldCoverQuery);

        if (!result.rowsCount) {
            throw new NotFoundError('Gagal memperbarui cover album. Id tidak ditemukan');
        }

        const oldCoverUrl = result.rows[0].cover_url;

        const updateCoverQuery = {
            text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
            values: [coverUrl, id],
        };

        const updateResult =await this._pool.query(updateCoverQuery);

        if (!updateResult.rows.length) {
            throw new NotFoundError('Gagal memperbarui cover album. Id tidak ditemukan');
        }

        if (oldCoverUrl) {
            const filename = oldCoverUrl.split('/').pop();
            const filePath = path.resolve(
                process.cwd(),
                'uploads',
                'images',
                filename,
            );

            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (error) {
                console.error('Error deleting old cover image:', error);
            }
            
        }
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

        return formattedAlbum;
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

export default AlbumsService;
