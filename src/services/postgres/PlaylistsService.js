const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const { Pool } = require('pg');

class PlaylistsService {
    constructor(pool){
        this._pool = pool || new Pool();
    }

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };
        const result = await this._pool.query(query);

        if (!result.rows[0].id) throw new InvariantError('Playlist gagal ditambahkan');

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: `SELECT p.id, p.name, u.username FROM playlists p
            LEFT JOIN users u ON p.owner = u.id
            WHERE p.owner = $1`,
            values: [owner],
        };
        const result = await this._pool.query(query);
        return result.rows;

    }

    async deletePlaylistById(playlistId) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [playlistId],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
        }

    }

    async addSongToPlaylist(playlistId, songId) {
        await this.verifyPlaylistExist(playlistId);

        const id = `playlist_songs${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Lagu gagal ditambahkan ke playlist');
        }

        return result.rows[0].id;
    }

    async getSongsFromPlaylist(playlistId) {
        const query = {
          text: `SELECT s.id, s.title, s.performer FROM songs s
          JOIN playlist_songs ps ON s.id = ps.song_id
          WHERE ps.playlist_id = $1`,
          values: [playlistId],
        };
        const result = await this._pool.query(query);
        return result.rows;

    }

    async deleteSongFromPlaylist(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu gagal dihapus dari playlist. Id tidak ditemukan');
        }
    }

    async verifyPlaylistExist(playlistId) {
        const query = {
            text: 'SELECT id FROM playlists WHERE id = $1',
            values: [playlistId],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        await this.verifyPlaylistExist(playlistId);

        const query = {
            text: 'SELECT id FROM playlists WHERE id = $1 AND owner = $2',
            values: [playlistId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new AuthenticationError('Anda tidak berhak mengakses playlist ini');
        }
    }
}

module.exports = PlaylistsService;