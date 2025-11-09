require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/Album');
const songs = require('./api/Song');
const AlbumsService = require('./services/postgres/AlbumsService');
const SongService = require('./services/postgres/SongsService');
const AlbumsValidator = require('./validator/album');
const ClientError = require('./exceptions/ClientError');
const SongsValidator = require('./validator/song');


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

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
  ]);

  
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const message = response.message || 'terjadi kesalahan pada client request';
        const newResponse = h.response({
          status: 'fail',
          message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer && response.output && response.output.statusCode) {
        const statusCode = response.output.statusCode;
        const message = (response.output.payload && response.output.payload.message) || response.message || 'resource tidak ditemukan';
        const newResponse = h.response({
          status: 'fail',
          message,
        });
        newResponse.code(statusCode);
        return newResponse;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
