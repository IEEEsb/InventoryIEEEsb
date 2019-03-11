const axios = require('axios');
const config = require('../config.json');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const {
	AuthenticationRequiredError, InvalidSessionError, InvalidScopeError, UnknownObjectError, AdminRequiredError,
} = require('../common/errors');

module.exports.getServiceData = async (req, res, next) => {
	try {
		return res.status(200).json({ service: config.auth.service, scope: config.auth.scope, server: config.auth.server });
	} catch (e) {
		return next(e);
	}
};

module.exports.login = async (req, res, next) => {
	try {
		const response = await axios.get(`${config.auth.server}/api/service/user`, { params: { token: req.body.token, secret: config.auth.secret } });
		const { data } = response;
		if (!data.name) throw new InvalidScopeError();

		const user = await User.findOneAndUpdate({ authId: data._id }, { $setOnInsert: { money: 0.0, name: data.name } }, { upsert: true, new: true, fields: '_id money name roles' });

		req.session.token = req.body.token;
		req.session.userId = user._id;
		return res.status(200).json({ user });
	} catch (e) {
		return next(e);
	}
};

module.exports.logout = async (req, res, next) => {
	try {
		return req.session.destroy((e) => {
			if (e) throw e;
			return res.sendStatus(204);
		});
	} catch (e) {
		return next(e);
	}
};

module.exports.addRole = async (req, res, next) => {
	try {
		const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { roles: req.body.role } }, { new: true, fields: '_id name money roles' });
		if (!user) throw new UnknownObjectError('User');

		return res.status(200).send({ user });
	} catch (e) {
		return next(e);
	}
};

module.exports.addMoney = async (req, res, next) => {
	try {
		const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $inc: { money: req.body.money } }, { new: true, fields: '_id name money roles' });
		if (!user) throw new UnknownObjectError('User');

		await Transaction.create({
			user: req.session.userId,
			type: 'addMoney',
			data: {
				to: user._id,
				money: req.body.money,
				from: 'cash',
			},
		});
		return res.status(200).send({ user });
	} catch (e) {
		return next(e);
	}
};

module.exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await User.find({ }, '_id money name roles');

		return res.status(200).json({ users });
	} catch (e) {
		return next(e);
	}
};

module.exports.getUser = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.params.userId }, '_id money name roles');

		return res.status(200).json({ user });
	} catch (e) {
		return next(e);
	}
};

module.exports.authRequired = async (req, res, next) => {
	if (!req.session.userId) return next(new AuthenticationRequiredError());

	return next();
};

module.exports.adminRequired = async (req, res, next) => {
	try {
		const user = await User.findById(req.session.userId);
		if (!user) throw new InvalidSessionError();
		if (!user.roles || !user.roles.includes(config.adminRole)) throw new AdminRequiredError();

		return next();
	} catch (e) {
		return next(e);
	}
};
