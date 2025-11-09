require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/Album');
const AlbumsService = require('./services/postgres/AlbumsService');
const SongService = require('./services/postgres/SongsService');
const NotesValidator = require('./validator/album');


const init = async () => {
  const notesService = new NotesService();
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
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
