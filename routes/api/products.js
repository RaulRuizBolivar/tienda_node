const express = require( "express" )
const router = express.Router()

const Product = require( "../../models/product.model" )


router.get( "/", ( req, res ) => {
  Product.find()
    .then( products => res.json( products ) )
    .catch( err => res.json( { error: err.message } ) )
} )

router.get( "/:price", ( req, res ) => {
  const { price } = req.params
  Product.find( {
    price: { $gt: price },
  } )
    .then( products => res.json( products ) )
    .catch( err => res.json( { error: err.message } ) )
} )

router.post( "/", ( req, res ) => {
  const { body } = req
  Product.create( body )
    .then( newProduct => res.status( 201 ).json( newProduct ) )
    .catch( err => res.status( 500 ).json( { error: err.message } ) )
} )

router.put( "/:id", async ( req, res ) => {
  try {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate( id, req.body, { new: true } )
    res.json( product )
  } catch ( err ) {
    res.json( { error: err.message } )
  }
} )
module.exports = router
