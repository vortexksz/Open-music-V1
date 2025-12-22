import {Pool} from 'pg';
import {nanoid} from 'nanoid';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import {mapDBToModelSong} from '../../utils/indexSong.js';

class SongService {
    constructor(){
        this._pool = new Pool();
    }

    async addSong({ title, year, genre, performer, duration, albumId }) {

        const id = nanoid(16);
        const query = {
            text: 'INSERT INTO songs (id, title, year, genre, performer, duration, album_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId],
        };

        const result = await this._pool.query(query);

        if(!result.rows[0].id){
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        return result.rows[0].id;
        
    }

    async getSongs({ title, performer }) {
        const conditions = [];
        const values = [];

        let query = {
            text: 'SELECT id, title, performer FROM songs',
            values: [],
        };

        if (title) {
            values.push(`%${title}%`);
            conditions.push(`title ILIKE $${values.length}`);
        }

        if (performer) {
            values.push(`%${performer}%`);
            conditions.push(`performer ILIKE $${values.length}`);
        }

        if (conditions.length > 0) {
            query.text += ` WHERE ${conditions.join(' AND ')}`;
        }

        query.values = values;
        
        const result = await this._pool.query(query);

        return result.rows.map(mapDBToModelSong);
    }


    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        return result.rows.map(mapDBToModelSong)[0];
    }

    async editSongById(id, { title, year, genre, performer, duration, albumId }) {
        const updatedAt = new Date();

        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING *',
            values: [title, year, genre, performer, duration, albumId, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui Lagu. Id tidak ditemukan');
        }

        return mapDBToModelSong(result.rows[0]);
    }

    async deleteSongById(id){
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }
    }
}

export default SongService;