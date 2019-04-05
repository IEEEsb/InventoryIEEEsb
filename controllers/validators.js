const { Joi, celebrate } = require('celebrate');
const { multiple } = require('../common/utils');

const customNumber = Joi.extend(joi => ({
	base: joi.number(),
	name: 'number',
	language: {
		multiple: 'needs to be a multiple of {{multiple}}',
	},
	rules: [
		{
			name: 'multiple',
			params: {
				multiple: joi.alternatives([joi.number().required().greater(0), joi.func().ref()]),
			},
			validate(params, value, state, options) {
				console.log(value, params);
				if (multiple(value, params.multiple)) {
					// Generate an error, state and options need to be passed, q is used in the language
					return this.createError('number.multiple', { v: value, multiple: params.multiple }, state, options);
				}

				return value; // Everything is OK
			},
		},
	],
}));

// Customize the default settings for Joi's validator, in a way that properties
// not defined in the validation schema don't produce any error, but are
// removed from the request
module.exports.validate = (validator, options) => (
	celebrate(validator, { stripUnknown: true, allowUnknown: true, ...options })
);
// A version of the validator that doesn't remove undefined properties from the
// response. Useful for validations that only forbid certain keys (like for
// updates)
module.exports.validateWithoutStripping = (validator, options) => (
	celebrate(validator, { allowUnknown: true, ...options })
);

module.exports.validators = {
	login: {
		body: {
			token: Joi.string().required().label('Token'),
		},
	},
	grantPermission: {
		body: {
			scope: Joi.array().items(Joi.string()).required().label('Scope'),
		},
	},
	getItems: {
		query: {
			pagesize: Joi.number().default(0).label('Tamaño de página'),
			page: Joi.number().default(1).label('Página'),
		},
	},
	item: {
		body: {
			code: Joi.number().greater(0).multiple(1).label('Código'),
			name: Joi.string().required().label('Nombre'),
			type: Joi.string().valid('consumable', 'lendable', 'static').required().label('Tipo'),
			step: Joi.number().required().label('Incremento de Cantidad'),
			quantity: Joi.number().min(0).multiple(Joi.ref('step')).required().label('Cantidad'),
			price: Joi.when('type', { is: 'consumable', then: Joi.number().min(0).required() }).label('Precio'),
			sellPercent: Joi.when('type', { is: 'consumable', then: Joi.number().required() }).label('Porcentaje de ganancia'),
			tags: Joi.array().items(Joi.string()).label('Tags'),
			icon: Joi.string().default('/assets/profile_icon.png').label('Icono'),
			files: Joi.array().items(Joi.string()).label('Archivos'),
		},
	},
	buyItem: {
		body: {
			quantity: Joi.number().greater(0).required().label('Cantidad'),
		},
	},
	startPurchase: {
		body: {
			totalPrice: customNumber.number().min(0.01).multiple(0.01).label('Precio Total'),
			moneyLeft: customNumber.number().min(0.01).multiple(0.01).label('Precio Total'),
		},
	},
	purchaseItem: {
		body: {
			quantityLeft: Joi.number().min(0).label('Cantidad Restante'),
			quantity: Joi.number().greater(0).label('Cantidad Comprada'),
			price: customNumber.number().greater(0).multiple(0.01).label('Precio'),
		},
	},
	addRole: {
		body: {
			role: Joi.string().regex(/[a-zA-Z]+/).required().label('Rol'),
		},
	},
	addMoney: {
		body: {
			money: Joi.number().greater(0).required().label('Dinero'),
		},
	},
	createPayment: {
		body: {
			money: Joi.number().greater(0).multiple(1).required().label('Dinero'),
		},
	},
	executePayment: {
		body: {
			payerId: Joi.string().required().label('PayerId'),
		},
	},
};
