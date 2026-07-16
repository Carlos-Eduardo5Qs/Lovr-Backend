function AppError(message, statusCode) {
    this.name = 'AppError';
    this.message = message;
    this.statusCode = statusCode;
    this.stack = (new Error()).stack;
};

AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

function ValidationError(message) {
    AppError.call(this, message , 400);
    this.name = 'ValidationError';
};

ValidationError.prototype = Object.create(AppError.prototype);
ValidationError.prototype.constructor = ValidationError;

function NotFoundError(message) {
    AppError.call(this, message || 'Campos obrigatórios ausentes' , 404);
    this.name = 'NotFoundError';   
};

NotFoundError.prototype = Object.create(AppError.prototype);
NotFoundError.prototype.constructor = NotFoundError;

function Unauthorized (message) {
    AppError.call(this, message || 'Acesso negado', 401);
    this.name = 'Unauthorized';
}

Unauthorized.prototype = Object.create(AppError.prototype);
Unauthorized.prototype.constructor = Unauthorized;

module.exports = {
    AppError,
    ValidationError,
    NotFoundError,
    Unauthorized
};