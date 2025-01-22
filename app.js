const express = require('express');
const app = express();

const productRoutes = require('./routes/products.routes');
const cartRoutes = require('./routes/carts.routes');

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});