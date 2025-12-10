import PlaylistHandler from './PlaylistHandler.js';
import PlaylistRoutes from './PlaylistRoutes.js';

const playlists = {
    name: 'playlists',
    version: '1.0.0',
    register: async (server, { service, validator, songService }) => {
        const playlistHandler = new PlaylistHandler(service, validator, songService);
        server.route(PlaylistRoutes(playlistHandler));
    },
};

export default playlists;