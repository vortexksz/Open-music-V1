require('dotenv').config();


//v1
const Hapi = require('@hapi/hapi');
const albums = require('./api/Album');
const songs = require('./api/Song');
const AlbumsService = require('./services/postgres/AlbumsService');
const SongService = require('./services/postgres/SongsService');
const AlbumsValidator = require('./validator/album');
const SongsValidator = require('./validator/song');
const ClientError = require('./exceptions/ClientError');

//v2
const Jwt = require('@hapi/jwt');
const playlists = require('./api/Playlist');
const PlaylistValidator = require('./validator/playlist');

const authentications = require('./api/Authentications');
const AuthenticationService = require('./services/postgres/AuthenticationService');
const AuthenticationsValidator = require('./validator/authentications');

const users = require('./api/users');
const UsersValidator = require('./validator/user');
const UsersService = require('./services/postgres/UsersService');
const TokenManager = require('./api/tokenize/TokenManager');
const PlaylistService = require('./services/postgres/PlaylistsService');



const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongService();
  const authenticationService = new AuthenticationService();
  const usersService = new UsersService();
  const playlistService = new PlaylistService();
  const tokenManager = TokenManager;

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
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: authentications,
      options: {
        authenticationsService: authenticationService,
        usersService,
        tokenManager,
        validator: AuthenticationsValidator,
      },
    },
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
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistService,
        validator: PlaylistValidator,
        songService: songsService,
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
