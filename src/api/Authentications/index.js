import AuthenticationsHandler from './handler.js';
import routes from './routes.js';

const authentications = {
    name: 'authentications',
    version: '1.0.0',
    register: async (server, { authenticationsService, usersService, tokenManager, validator }) => {
        const handler = new AuthenticationsHandler(
            authenticationsService,
            usersService,
            tokenManager,
            validator,
        );
        server.route(routes(handler));
    },
};

export default authentications;