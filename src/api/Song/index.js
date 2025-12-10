import SongHandler from './SongHandler.js';
import SongRoutes from './SongRoutes.js';

const songs = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songHandler = new SongHandler(service, validator);
    server.route(SongRoutes(songHandler));
  },
};

export default songs;
