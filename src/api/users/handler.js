class UsersHandler {
    constructor(service, validator) {
        this.service = service;
        this.validator = validator;
    }

    async postUserHandler(request, h) {
        this.validator.validateUserPayload(request.payload);
        const { username, password, fullname } = request.payload;

        const userId = await this.service.addUser({ username, password, fullname });

        const response = h.response({
            status: 'success',
            message: 'User berhasil ditambahkan',
            data: {
                userId,
            },
        });
        response.code(201);
        return response;
    }    

    async getUserByIdHandler(request, h) {
        const { id } = request.params;
        const user = await this.service.getUserById(id);

        return {
            status: 'success',
            data: {
                user,
            },
        };
    }

    async getUserByUsernameHandler(request) {
        const { username } = request.query;
        const users = await this.service.getUserByUsername(username);

        return {
            status: 'success',
            data: {
                users,
            },
        };
    }
    
}

module.exports = UsersHandler;