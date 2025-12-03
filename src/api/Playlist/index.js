const PlaylistHandler = require('./PlaylistHandler');
const PlaylistRoutes = require('./PlaylistRoutes');

module.exports = {
    name: 'playlists',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const playlistHandler = new PlaylistHandler(service, validator);
        server.route(PlaylistRoutes(playlistHandler));
    },
};