const mongoose = require( 'mongoose' )
const Schema = mongoose.Schema

const userSchema = new Schema( {
	email: String,
	password: String,
	username: String,
	products: [ {
		type: Schema.Types.ObjectId,
		ref: 'product'
	} ]
} )

module.exports = mongoose.model( "user", userSchema )
