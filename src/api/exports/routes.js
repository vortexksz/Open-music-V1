const routes = (handler) => [

    {
        method: 'POST',
        path: '/exports/playlists/{playlistId}',
        handler: handler.exportPlaylistHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
];

export default routes;