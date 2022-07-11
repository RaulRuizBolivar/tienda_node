const request = require( "supertest" )
const app = require( "../app" )
const mongoose = require( "mongoose" )
const Producto = require( "../models/product.model" )

describe( "Products Tests", () => {
  // Antes de lanzar todas las pruebas, debo conectarme a la base de datos
  beforeAll( async () => {
    await mongoose.connect( "mongodb://127.0.0.1:27017/tienda_online" )
  } )
  // Despues de lanzar todas las pruebas, debo desconectarme de la base de
  // datos
  afterAll( async () => {
    await mongoose.disconnect()
  } )
  describe( "GET /api/products", () => {
    let response
    beforeAll( async () => {
      response = await request( app ).get( "/api/products" ).send()
    } )
    it( "deberia devolver un status 200", () => {
      expect( response.statusCode ).toBe( 200 )
    } )
    it( "deberia devolver un objeto en formato JSON", () => {
      expect( response.headers[ "content-type" ] ).toContain( "json" )
    } )
    it( "deberia devolver un array", () => {
      expect( response.body ).toBeInstanceOf( Array )
    } )
  } )
  describe( "POST /api/products", () => {
    /**
     * Antes de cada prueba, realizar la peticion de tipo POST sobre /api/products
     * Probamos si la respuesta devuelve status 201
     * Probamos si la respuesta viene en formato JSON
     * Probamos si en el cuerpo de la respuesta viene definida la propiedad _id
     */
    let newProduct = {
      name: "lapiz verde",
      description: "Pinta muy bien pero solo en verde",
      department: "test",
      stock: "100",
      available: true,
      price: 20,
    }
    let response
    beforeAll( async () => {
      response = await request( app ).post( "/api/products" ).send( newProduct )
    } )
    afterAll( async () => {
      await Producto.deleteMany( {
        department: "test",
      } )
    } )
    it( "deberia devolver un status 201", () => {
      expect( response.statusCode ).toBe( 201 )
    } )
    it( "deberia responderme con un JSON", () => {
      expect( response.headers[ "content-type" ] ).toContain( "json" )
    } )
    it( "deberia devolverme el atributo _id en la respuesta", () => {
      expect( response.body._id ).toBeDefined()
    } )
  } )
  /**
   *
   * Pruebas
   *   - PUT /api/products/id
   *   - Probamos status 200 y content type json
   *   - Antes de cada prueba
   *     - Creamos un Producto (Product.create)
   *     - Lanzamos la peticion a partir del id del producto anterior
   *     - Dentro del send incluimos un objeto con los datos a modificar
   *     ({price: 45  ,stock : 200})
   *
   *
   *
   * */

  describe( "PUT /api/products/:id", () => {
    let newProduct = {
      name: "teclado",
      description: "Para programar las cosicas",
      department: "informatica",
      stock: "122",
      available: true,
      price: 200,
    }
    let edit = {
      price: 45,
      stock: 200,
    }
    let response
    let productToEdit
    beforeEach( async () => {
      productToEdit = await Producto.create( newProduct )
      response = await request( app )
        .put( "/api/products/" + productToEdit._id )
        .send( edit )
    } )
    afterEach( async () => {
      await Producto.findByIdAndDelete( productToEdit._id )
    } )
    it( "deberia devolver un status 200", () => {
      console.log( response )
      expect( response.statusCode ).toBe( 200 )
    } )
    it( "deberia devolver un json", () => {
      expect( response.headers[ "content-type" ] ).toContain( "json" )
    } )
    it( "El objeto devuelto debe contener los atributos editados", () => {
      expect( response.body.price ).toBe( 45 )
      expect( response.body.stock ).toBe( 200 )
    } )
  } )

  describe( 'DELETE /api/products/:productoId', () => {
    let productToDelete
    let response
    beforeEach( async () => {
      productToDelete = await Producto.create( {
        name: "teclado",
        description: "Para programar las cosicas",
        department: "informatica",
        stock: "122",
        available: true,
        price: 200,
      } )
      response = await request( app ).delete( `/api/products/${ productToDelete._id }` ).send()
    } )
    afterEach( async () => {
      await Producto.findByIdAndDelete( productToDelete._id )
    } )
    it( 'deberia devolver un status 200', () => {
      expect( response.statusCode ).toBe( 200 )
      expect( response.headers[ 'content-type' ] ).toContain( 'json' )
    } )
    it( 'el id del producto no deberia de estar en la base de datos', async () => {
      const product = await Producto.findById( productToDelete._id )
      expect( product ).toBeNull()
    } )
  } )


} )
