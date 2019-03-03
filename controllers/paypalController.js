const paypal = require('paypal-rest-sdk');
const config = require('../config.json');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { round } = require('../common/utils');

const {
	PaymentNotApprovedError,
} = require('../common/errors');

const { payments } = paypal.v1;
const { clientId, clientSecret, mode, fee } = config.paypal;

let env;
if (mode === 'live') {
	env = new paypal.core.LiveEnvironment(clientId, clientSecret); // Live account
} else {
	env = new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

const client = new paypal.core.PayPalHttpClient(env);

exports.createPayment = async (req, res, next) => {
	try {
		const money = round(round(((req.body.money * fee.rate + fee.fix) / (1 - fee.rate)), 2) + req.body.money, 2);
		const payment = {
			intent: 'sale',
			payer: {
				payment_method: 'paypal',
			},
			redirect_urls: {
				return_url: 'https://ieeesb.es',
				cancel_url: 'https://ieeesb.es',
			},
			transactions: [{
				amount: {
					currency: 'EUR',
					total: money,
				},
				description: 'Nevera Cubo',
			}],
		};

		const request = new payments.PaymentCreateRequest();
		request.requestBody(payment);

		const response = await client.execute(request);
		return res.status(200).json({ id: response.result.id });
	} catch (e) {
		return next(e);
	}
};

exports.executePayment = async (req, res, next) => {
	try {
		const request = new payments.PaymentExecuteRequest(req.params.paymentId);
		request.requestBody({ payer_id: req.body.payerId });

		const response = await client.execute(request);
		if (response.state !== 'approved') throw new PaymentNotApprovedError();


		let money = parseFloat(response.result.transactions[0].amount.total);

		money = round(money * (1 - fee.rate) - fee.fix, 2);

		const user = await User.findOneAndUpdate({ _id: req.session.userId }, { $inc: { money } }, { new: true });

		await Transaction.create({
			user: req.session.userId,
			type: 'addMoney',
			data: {
				to: req.session.userId,
				money,
				from: 'paypal',
			},
		});
		return res.status(200).send({ user });
	} catch (e) {
		return next(e);
	}
};
