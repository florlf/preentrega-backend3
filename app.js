const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const ProductManager = require('./managers/ProductManager');
const pm = new ProductManager();
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products', async (req, res) => {
    try {
        const products = await pm.getProducts();
        res.render('index', { products });
    } catch (error) {
        console.log('Error al obtener productos:', error);
        res.render('index', { products: [] });
    }
});

app.get('/', (req, res) => {
    res.redirect('/products');
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await pm.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.log('Error al obtener productos:', error);
        res.render('realTimeProducts', { products: [] });
    }
});

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    pm.getProducts().then(products => {
        socket.emit('updateProducts', products);
    });

    socket.on('newProduct', async (product) => {
        const newProduct = await pm.addProduct(product);
        io.emit('updateProducts', await pm.getProducts());
    });

    socket.on('deleteProduct', async (productId) => {
        await pm.deleteProduct(productId);
        io.emit('updateProducts', await pm.getProducts());
    });

    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});