import ExportPlaylistHandler from "./handler.js";
import routes from "./routes.js";

const exports = {
    name: 'exports',
    version: '1.0.0',
    register: async (server, { producerService, playlistService, validator }) => {
        const exportPlaylist = new ExportPlaylistHandler(producerService, playlistService, validator);
        server.route(routes(exportPlaylist));
    },      
};

export default exports;