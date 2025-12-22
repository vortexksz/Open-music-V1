import UploadsHandler from "./handler.js";
import UploadsRoutes from "./routes.js";

const uploads = {
    name: 'uploads',
    version: '1.0.0',
    register: async (server, { storageService, albumsService, validator }) => {
        const uploadsHandler = new UploadsHandler(storageService, albumsService, validator);
        server.route(UploadsRoutes(uploadsHandler));
    },
};

export default uploads;