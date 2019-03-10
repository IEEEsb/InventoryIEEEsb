const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const Purchase = require('../models/Purchase');
const { round, multiple } = require('../common/utils');

const {
	UnknownObjectError, NotEnoughItemError, NotEnoughMoneyError, InvalidQuantityError, InternalError, NotConsumableItemError,
} = require('../common/errors');

exports.getConsumableItems = async (req, res, next) => {
	try {
		const { pageSize, page } = req.query;
		const skip = pageSize * (page - 1);
		const items = await Item.find({ type: 'consumable' }).limit(pageSize).skip(skip).sort('name');
		return res.status(200).send({ items });
	} catch (e) {
		return next(e);
	}
};

exports.getItem = async (req, res, next) => {
	try {
		const item = await Item.findById(req.params.itemId);
		if (!item) throw new UnknownObjectError('Item');

		return res.status(200).send({ item });
	} catch (e) {
		return next(e);
	}
};

exports.getItemByCode = async (req, res, next) => {
	try {
		const item = await Item.findOne({ code: req.params.code });
		if (!item) throw new UnknownObjectError('Item');

		return res.status(200).send({ item });
	} catch (e) {
		return next(e);
	}
};

exports.getTags = async (req, res, next) => {
	try {
		const tags = await Item.distinct('tags');
		tags.sort();
		return res.status(200).send({ tags });
	} catch (e) {
		return next(e);
	}
};

exports.addItem = async (req, res, next) => {
	try {
		const codes = await Item.distinct('code');
		codes.sort();
		const initial = 100000;
		if (!req.body.code) {
			req.body.code = initial;
			for (const code of codes) {
				if (req.body.code < code) {
					break;
				}
				if (code + 1 > initial) {
					req.body.code = code + 1;
				}
			}
		}
		const item = await Item.create(req.body);
		return res.status(200).send({ item });
	} catch (e) {
		return next(e);
	}
};

exports.updateItem = async (req, res, next) => {
	try {
		const item = await Item.findOneAndUpdate({ _id: req.params.itemId }, { $set: req.body }, { new: true });
		if (!item) throw new UnknownObjectError('Item');

		// logger.logUpdate(req.session.user._id, item._id, !!req.body.reset);
		return res.status(200).send({ item });
	} catch (e) {
		return next(e);
	}
};

exports.removeItem = async (req, res, next) => {
	try {
		const item = await Item.findByIdAndRemove(req.params.itemId);
		if (!item) throw new UnknownObjectError('Item');

		return res.sendStatus(204);
	} catch (e) {
		return next(e);
	}
};

exports.buyItem = async (req, res, next) => {
	const { quantity } = req.body;

	try {
		let item = await Item.findById(req.params.itemId);
		if (!item) throw new UnknownObjectError('Item');
		if (item.type !== 'consumable') throw new NotConsumableItemError();

		let user = await User.findById(req.session.userId);

		if (quantity > item.quantity) throw new NotEnoughItemError();
		if (multiple(quantity, item.step)) throw new InvalidQuantityError(item.step);

		const price = round(item.price * (1 + item.sellPercent / 100.0), 2);
		const finalPrice = price * quantity;
		if (finalPrice > user.money) throw new NotEnoughMoneyError();

		const session = await mongoose.startSession();
		session.startTransaction();

		item = await Item.findOneAndUpdate({ _id: req.params.itemId }, { $inc: { quantity: -quantity } }, { new: true }).session(session);
		if (!item) {
			await session.abortTransaction();
			throw new NotEnoughItemError();
		}

		user = await User.findOneAndUpdate({ _id: user._id }, { $inc: { money: -finalPrice } }, { new: true }).session(session);
		if (!user) {
			await session.abortTransaction();
			throw new NotEnoughMoneyError();
		}

		await session.commitTransaction();
		await Transaction.create({
			user: req.session.userId,
			type: 'buy',
			data: {
				item: item._id,
				quantity,
				itemPrice: item.price,
				sellPercent: item.sellPercent,
				finalPrice,
				quantityLeft: item.quantity,
				moneyLeft: user.money,
			},
		});
		return res.status(200).json({ money: user.money, item });
	} catch (e) {
		return next(e);
	}
};

exports.getUserPurchases = async (req, res, next) => {
	try {
		const purchases = await Transaction.find({ user: req.params.userId, type: 'buy' }).sort('-date').populate({ path: 'data.item', model: Item, select: '_id name' });
		return res.status(200).send({ purchases });
	} catch (e) {
		return next(e);
	}
};

exports.cancelUserPurchase = async (req, res, next) => {
	try {
		let transaction = await Transaction.findOneAndUpdate({ _id: req.params.purchaseId, cancelled: false }, { $set: { cancelled: true } }, { new: true });
		if (!transaction) throw new UnknownObjectError('Transaction');

		const session = await mongoose.startSession();
		session.startTransaction();

		const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $inc: { money: transaction.data.finalPrice } }, { new: true }).session(session);
		if (!user) {
			await session.abortTransaction();
			throw new InternalError();
		}

		const item = await Item.findOneAndUpdate({ _id: transaction.data.item }, { $inc: { quantity: transaction.data.quantity } }, { new: true }).session(session);
		if (!item) {
			await session.abortTransaction();
			throw new InternalError();
		}

		await session.commitTransaction();

		transaction = await Transaction.create({ user: req.session.userId, type: 'cancel', data: { transactionId: req.params.purchaseId } });

		return res.status(200).send({ money: user.money, item });
	} catch (e) {
		return next(e);
	}
};

exports.getPurchase = async (req, res, next) => {
	try {
		const purchase = await Purchase.findOne({ _id: req.params.purchaseId }).populate({ path: 'items.item' });
		if (!purchase) throw new UnknownObjectError('Purchase');

		return res.status(200).send({ purchase });
	} catch (e) {
		return next(e);
	}
};

exports.getAllPurchases = async (req, res, next) => {
	try {
		const purchases = await Purchase.find({}).sort('-date').populate({ path: 'items.item' });

		return res.status(200).send({ purchases });
	} catch (e) {
		return next(e);
	}
};

exports.startPurchase = async (req, res, next) => {
	try {
		const purchase = await Purchase.create({ totalPrice: req.body.totalPrice, user: req.session.userId, moneyLeft: req.body.moneyLeft });

		return res.status(200).send({ purchase });
	} catch (e) {
		return next(e);
	}
};

exports.updatePurchase = async (req, res, next) => {
	let session;
	try {
		const purchase = await Purchase.findOneAndUpdate({ _id: req.params.purchaseId, finished: false }, { $set: { totalPrice: req.body.totalPrice, moneyLeft: req.body.moneyLeft } }, { new: true }).populate({ path: 'items.item' });

		return res.status(200).send({ purchase });
	} catch (e) {
		if (session) {
			session.abortTransaction();
		}
		return next(e);
	}
};

exports.endPurchase = async (req, res, next) => {
	let session;
	try {
		let purchase = await Purchase.findOne({ _id: req.params.purchaseId, finished: false });
		if (!purchase) throw new UnknownObjectError('Purchase');

		session = await mongoose.startSession();
		session.startTransaction();

		const results = [];
		for (const item of purchase.items) {
			results.push(Item.findOneAndUpdate({ _id: item.item }, { $set: { quantity: (item.quantityLeft.real + item.quantity), price: item.price } }).session(session));
		}

		await Promise.all(results);

		await session.commitTransaction();

		purchase = await Purchase.findOneAndUpdate({ _id: req.params.purchaseId }, { $set: { finished: true } }, { new: true }).populate({ path: 'items.item' });

		return res.status(200).send({ purchase });
	} catch (e) {
		if (session) {
			session.abortTransaction();
		}
		return next(e);
	}
};

exports.removePurchase = async (req, res, next) => {
	let session;
	try {
		await Purchase.remove({ _id: req.params.purchaseId, finished: false });

		return res.sendStatus(204);
	} catch (e) {
		if (session) {
			session.abortTransaction();
		}
		return next(e);
	}
};

exports.addPurchaseItem = async (req, res, next) => {
	try {
		let purchase = await Purchase.findOne({ _id: req.params.purchaseId, finished: false, 'items.item': { $not: { $eq: req.params.itemId } } });
		if (!purchase) throw new UnknownObjectError('Purchase/Item');

		const item = await Item.findById(req.params.itemId);
		if (!item) throw new UnknownObjectError('Item');
		if (multiple(req.body.quantity, item.step)) throw new InvalidQuantityError(item.step);
		if (multiple(req.body.quantityLeft, item.step)) throw new InvalidQuantityError(item.step);

		const purchaseItem = {
			item: item._id,
			quantityLeft: {
				real: req.body.quantityLeft,
				inventory: item.quantity,
			},
			quantity: req.body.quantity,
			price: req.body.price,
		};
		purchase = await Purchase.findOneAndUpdate({ _id: req.params.purchaseId }, { $push: { items: purchaseItem } }, { new: true }).populate({ path: 'items.item' });

		return res.status(200).send({ purchase });
	} catch (e) {
		return next(e);
	}
};

exports.updatePurchaseItem = async (req, res, next) => {
	try {
		const item = await Item.findById(req.params.itemId);
		if (!item) throw new UnknownObjectError('Item');
		if (multiple(req.body.quantity, item.step)) throw new InvalidQuantityError(item.step);
		if (multiple(req.body.quantityLeft, item.step)) throw new InvalidQuantityError(item.step);

		const setItem = {
			'items.$.quantityLeft.real': req.body.quantityLeft,
			'items.$.quantity': req.body.quantity,
			'items.$.price': req.body.price,
		};
		const purchase = await Purchase.findOneAndUpdate({ _id: req.params.purchaseId, finished: false, 'items.item': req.params.itemId }, { $set: setItem }, { new: true }).populate({ path: 'items.item' });
		if (!purchase) throw new UnknownObjectError('Purchase/Item');

		return res.status(200).send({ purchase });
	} catch (e) {
		return next(e);
	}
};
