import AlbumLikesHandler from './handler.js';
import routes from './routes.js';

const albumLikes = {
    name: 'albumLikes',
    version: '1.0.0',
    register: async (server, { albumLikesService, albumsService, validator }) => {
        const albumLikesHandler = new AlbumLikesHandler(albumLikesService, albumsService, validator);
        server.route(routes(albumLikesHandler));
    }
};

export default albumLikes;