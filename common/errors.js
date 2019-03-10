const { isCelebrate } = require('celebrate');

class CustomError extends Error {
	constructor(message, code, httpStatus) {
		super(message);
		this.errObject = { message, code };
		this.httpStatus = httpStatus;
	}
}

module.exports.InternalError = class InternalError extends CustomError {
	constructor() {
		super('Internal error. Try again later', 'internal_error', 500);
	}
};

module.exports.InvalidSessionError = class InvalidSessionError extends CustomError {
	constructor() {
		super('Invalid session. Please log in again', 'invalid_session', 401);
	}
};

module.exports.InvalidScopeError = class InvalidScopeError extends CustomError {
	constructor() {
		super('Service don\'t have the right permissions to access user\'s data', 'invalid_scope', 401);
	}
};

module.exports.AdminRequiredError = class AdminRequiredError extends CustomError {
	constructor() {
		super('You must be an admin to do that', 'admin_required', 403);
	}
};

module.exports.AuthenticationRequiredError = class AuthenticationRequiredError extends CustomError {
	constructor() {
		super('You must be logged in to do that', 'authentication_required', 401);
	}
};

module.exports.NotConsumableItemError = class NotConsumableItemError extends CustomError {
	constructor() {
		super('This item can\'t be bought', 'not_consumable_item', 403);
	}
};

module.exports.NotEnoughItemError = class NotEnoughItemError extends CustomError {
	constructor() {
		super('There are not enough items', 'not_enough_item', 403);
	}
};

module.exports.NotEnoughMoneyError = class NotEnoughMoneyError extends CustomError {
	constructor() {
		super('You don\'t have enough money', 'not_enough_money', 403);
	}
};

module.exports.InvalidQuantityError = class InvalidQuantityError extends CustomError {
	constructor(multiple) {
		super(`Invalid quantity. It has to be multiple of ${multiple}`, 'not_enough_item', 403);
	}
};

module.exports.DuplicateObjectError = class DuplicateObjectError extends CustomError {
	constructor(objectType) {
		super(`A(n) "${objectType}" object with that name already exists`, 'duplicate_object', 400);
	}
};

module.exports.PaymentNotApprovedError = class PaymentNotApprovedError extends CustomError {
	constructor() {
		super('The payment hasn\'t been approved', 'payment_not_approved', 401);
	}
};

module.exports.InvalidPermissionsError = class InvalidPermissionsError extends CustomError {
	constructor() {
		super('You don\'t have the required permissions to access to this user', 'invalid_permissions', 401);
	}
};

module.exports.PollsNotClosedError = class PollsNotClosedError extends CustomError {
	constructor(closingDate) {
		super(`The polls are still open, you must wait until they close (${closingDate.toISOString()})`, 'polls_still_open', 400);
	}
};

module.exports.UnknownObjectError = class UnknownObjectError extends CustomError {
	constructor(objectType) {
		super(`There are no "${objectType}" objects with such name`, 'unknown_object', 404);
	}
};

module.exports.WrongPropertiesError = class WrongPropertiesError extends CustomError {
	constructor() {
		super('None of the provided parameters are compatible with this model', 'no_valid_model_properties', 400);
	}
};

// eslint-disable-next-line no-unused-vars
module.exports.globalErrorHandler = (err, req, res, next) => {
	// This is a controlled error, it has been thrown by demokratia's own
	// code and we expected it might happen
	if (err instanceof CustomError) {
		return res.status(err.httpStatus).json(err.errObject);
	}
	// The exception for parameter validation problems is already provided
	// by celebrate, using that one to put the violations in the error object
	// as well
	if (isCelebrate(err)) {
		return res.status(400).json({
			message: 'Invalid parameters',
			code: 'invalid_parameters',
			violations: err.details,
		});
	}


	if (err.request) {
		if (!err.response) {
			return res.status(500).json({
				message: 'Authentication server is not available',
				code: 'Auth_server_down',
			});
		}
		return res.status(err.response.status).json({
			message: err.response.data.message,
			code: err.response.data.code,
		});
	}

	if (err.name === 'MongoError') {
		if (err.code === 11000) {
			const key = /.*index:\s(.*)_1/.exec(err.errmsg)[1];
			return res.status(400).json({
				message: 'Duplicate key error',
				code: 'duplicate_key',
				key,
			});
		}
	}

	// Errors produced by Express's body-parser, that are thrown whenever the
	// body cannot be parsed because it isn't valid JSON
	if (err.type === 'entity.parse.failed') {
		return res.status(400).json({
			message: 'Invalid JSON object in the request\'s body',
			code: 'invalid_json_body',
		});
	}
	// Unknown error, something we haven't handled (and a potential bug).
	// Throw an internal server error and display it in the logs
	console.error(err); // eslint-disable-line no-console
	return res.status(500).json({
		message: 'Internal server error',
		code: 'internal_server_error',
	});
};
