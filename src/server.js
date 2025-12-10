import 'dotenv/config';



//v1
import Hapi from '@hapi/hapi';
import albums from './api/Album/index.js';
import songs from './api/Song/index.js';
import AlbumsService from './services/postgres/AlbumsService.js';
import SongService from './services/postgres/SongsService.js';
import AlbumsValidator from './validator/album/index.js';
import SongsValidator from './validator/song/index.js';
import ClientError from './exceptions/ClientError.js';

//v2
import Jwt from '@hapi/jwt';
import playlists from './api/Playlist/index.js';
import PlaylistValidator from './validator/playlist/index.js';

import authentications from './api/Authentications/index.js';
import AuthenticationService from './services/postgres/AuthenticationService.js';
import AuthenticationsValidator from './validator/authentications/index.js';

import users from './api/users/index.js';
import UsersValidator from './validator/user/index.js';
import UsersService from './services/postgres/UsersService.js';
import TokenManager from './api/tokenize/TokenManager.js';
import PlaylistService from './services/postgres/PlaylistsService.js';



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
