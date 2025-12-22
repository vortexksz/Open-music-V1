import path from 'path';

const UploadsRoutes = (handler) => [
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: handler.postUploadAlbumCoverHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 512000,
            }
        }
    },

    {
        method: 'POST',
        path: '/albums/covers/{params*}',
        handler: {
            directory: {
                path: path.resolve(process.cwd(), 'uploads/images'),
            },
        },
    },
];

export default UploadsRoutes;