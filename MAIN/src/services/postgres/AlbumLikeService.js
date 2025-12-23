import { Pool } from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";

class AlbumLikeService {
    constructor(albumService, cacheService) {
        this._pool = new Pool();
        this._albumService = albumService;
        this._cacheService = cacheService;
    }

    async verifyAlbumLike(userId, albumId) {
        const query = {
            text : 'SELECT id FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
            values: [albumId, userId],
        };

        const result = await this._pool.query(query);

        if (result.rows.length) {
            throw new InvariantError('User sudah menyukai album ini');
        }
    }

    async addAlbumLike(userId, albumId) {
        try {
            await this._albumService.getAlbumById(albumId);
        } catch (error) {
            throw new NotFoundError('Album tidak ditemukan');
        }
        await this.verifyAlbumLike(userId, albumId);

        const id = `like-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
            values: [id, userId, albumId],
        };

        const { rowCount } = await this._pool.query(query);

        if (!rowCount) {
            throw new InvariantError('Gagal menyukai album');
        }

        const message = 'Album berhasil disukai';

        await this._cacheService.delete(`album_likes:${albumId}`);

        return message;
    }

    async deleteAlbumLike(userId, albumId) {
        const query = {
            text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
            values: [albumId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Gagal batal menyukai album');
        }

        const message = 'Album berhasil batal disukai';

        await this._cacheService.delete(`album_likes:${albumId}`);

        return message;
    }

    async getAlbumLikes(albumId) {
        try {
            const result = await this._cacheService.get(`album_likes:${albumId}`);
            return {
                likes: Number(JSON.parse(result)),
                fromCache: true,
            };
        } catch (error) {
            const query = {
                text: 'SELECT COUNT(*) AS likes FROM user_album_likes WHERE album_id = $1',
                values: [albumId],
            };

            const result = await this._pool.query(query);
        
            const likesCount = Number(result.rows[0].likes); 

            await this._cacheService.set(`album_likes:${albumId}`, JSON.stringify(likesCount));

            return {
                likes: likesCount, 
                fromCache: false,
            };
        }
    }   
}

export default AlbumLikeService;