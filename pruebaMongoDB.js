const mongoose = require("mongoose")

const Product = require("./models/product.model")

mongoose.connect("mongodb://127.0.0.1:27017/tienda_online")

;// Crear productos
(async () => {
  //await Product.create({
  //  name: "Sarten",
  //  description: "Para hacer huevos fritos",
  //  price: 30,
  //  stock: 43,
  //  department: "cocina",
  //  available: false,
  //})
  
  //Recupero documentos
  const products = await Product.find({
    department: 'cocina',
    price: {$lt: 500}
  })
  console.log(products)
  mongoose.disconnect()
})()
