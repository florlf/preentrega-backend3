require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const Cart = require('./models/Cart');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./config/passport');
require('./models/Ticket');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const Product = require('./models/Product');
const productRoutes = require('./routes/products.routes');
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');


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
      lt: (a, b) => a < b,
      totalCart: (products) => {
        return products.reduce((total, item) => {
          return total + (item.product.price * item.quantity);
        }, 0);
      }
    }
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.set('io', io);

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
}));


app.use(async (req, res, next) => {
  if (!req.session.cartId) {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    req.session.cartId = newCart._id;
  }
  next();
});

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use('/', require('./routes/views.router'));
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/sessions', require('./routes/auth.routes'));
app.use('/api/carts', require('./routes/carts.routes'));

app.get('/', (req, res) => {
  res.redirect('/products');
});

io.on('connection', (socket) => {
  Product.find().lean()
    .then(products => socket.emit('updateProducts', products))
    .catch(error => console.error('Error al obtener productos:', error));

  socket.on('disconnect', () => {
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});