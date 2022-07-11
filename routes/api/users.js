const router = require( 'express' ).Router()

const User = require( '../../models/user.model' )


router.get( '/', async ( req, res ) => {
	try {
		const users = await User.find().populate( 'products' ).exec()
		res.json( users )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

router.post( '/', ( req, res ) => {
	const { body } = req
	User.create( body )
		.then( userCreated => res.status( 201 ).json( userCreated ) )
		.catch( err => res.json( { 'error': err.message } ) )
} )

router.put( '/:idUser/product/:idProduct', async ( req, res ) => {
	try {
		const { idUser, idProduct } = req.params
		let usuario = await User.findById( idUser )
		usuario.products.push( idProduct )
		// Guardo el usuario en la base de datos
		await usuario.save()
		res.json( usuario )
	} catch ( err ) {
		res.json( { error: err.message } )
	}
} )

module.exports = router