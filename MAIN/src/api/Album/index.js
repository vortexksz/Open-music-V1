import AlbumHandler from './AlbumHandler.js';
import AlbumRoutes from './AlbumRoutes.js';


const albums = {
    name: 'albums',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const albumsHandler = new AlbumHandler(service, validator);
        server.route(AlbumRoutes(albumsHandler));
    },
};

export default albums;