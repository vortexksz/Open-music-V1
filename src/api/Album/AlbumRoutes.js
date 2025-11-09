const AlbumRoutes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbumHandler, // postNoteHandler hanya menerima dan menyimpan "satu" note.
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbumByIdHandler, // getNoteByIdHandler mengembalikan "satu" note.
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putAlbumByIdHandler, // putNoteByIdHandler hanya menerima dan mengubah "satu" note.
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbumByIdHandler,
  },
];

module.exports = AlbumRoutes;
