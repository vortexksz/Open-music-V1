const AlbumHandler = require('./AlbumHandler');
const Albumroutes = require('./AlbumRoutes');

module.exports = {
    name : 'albums',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const albumsHandler = new AlbumHandler(service, validator);
        server.route(Albumroutes(AlbumHandler));

    }

};