require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/Album');
const songs = require('./api/Song');
const AlbumsService = require('./services/postgres/AlbumsService');
const SongService = require('./services/postgres/SongsService');
const AlbumsValidator = require('./validator/album');


const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },

    plugin: songs,
    options: {
      service: songService,
      validator: SongsValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
