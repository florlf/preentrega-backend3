require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const Cart = require('./models/Cart');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión:', err));

app.engine('handlebars', handlebars.engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: { 
    eq: (a, b) => a === b,
    lt: (a, b) => a < b
  }
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.set('io', io);

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(async (req, res, next) => {
  if (!req.session.cartId) {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    req.session.cartId = newCart._id;
  }
  next();
});

app.use((req, res, next) => {
  res.locals.cartId = req.session.cartId;
  next();
});

app.use('/api/products', require('./routes/products.routes'));
app.use('/api/carts', require('./routes/carts.routes'));

app.use('/', require('./routes/views.router'));

app.get('/', (req, res) => {
  res.redirect('/products');
});

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  Product.find().lean()
    .then(products => socket.emit('updateProducts', products))
    .catch(error => console.error('Error al obtener productos:', error));

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});