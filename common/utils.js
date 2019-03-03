const crypto = require('crypto');
const Decimal = require('decimal.js');

// Check if two arrays of primitive types contain the same elements
module.exports.arraysEqual = (a, b) => {
	if (!(a instanceof Array && b instanceof Array)) return false;
	if (a.length !== b.length) return false;

	// .sort() mutates the original array, so we make a coy via .slice()
	const sortedA = a.slice().sort();
	const sortedB = b.slice().sort();

	for (let i = 0; i < a.length; i++) {
		if (sortedA[i] !== sortedB[i]) return false;
	}

	return true;
};

module.exports.arrayContainsArray = (array, contains) => (
	contains.reduce((l, a) => array.indexOf(a) >= 0 && l, true)
);

module.exports.round = (number, decimals) => (
	Math.round(number * (10 ** decimals)) / (10 ** decimals)
);

module.exports.multiple = (number, multiple) => (
	(new Decimal(number)).mod(multiple).cmp(0)
);

module.exports.randomString = len => crypto.randomBytes(len).toString('hex');
module.exports.randomStringClou = len => () => module.exports.randomString(len);
