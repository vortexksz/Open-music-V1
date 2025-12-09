const PlaylistHandler = require('./PlaylistHandler');
const PlaylistRoutes = require('./PlaylistRoutes');

module.exports = {
    name: 'playlists',
    version: '1.0.0',
    register: async (server, { service, validator, songService }) => {
        const playlistHandler = new PlaylistHandler(service, validator, songService);
        server.route(PlaylistRoutes(playlistHandler));
    },
};