const mongoose = require('mongoose');
const Float = require('mongoose-float').loadType(mongoose);

const { Schema } = mongoose;

const User = new Schema({
	authId: { type: String, index: { unique: true, dropDups: true } },
	money: { type: Float, default: 0.0 },
	name: { type: String, required: true },
	roles: [{ type: String }],
});

module.exports = mongoose.model('User', User);
