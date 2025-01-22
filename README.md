# Proyecto Carrito de Compras - Pre-entrega 1

Este es un servidor implementado en **Node.js** y **Express** que simula un sistema de manejo de productos y carritos de compras. La persistencia de datos se realiza utilizando archivos JSON para almacenar los productos y carritos.


El servidor proporciona dos grupos de rutas:

1. **/products**: Permite gestionar los productos.
2. **/carts**: Permite gestionar los carritos de compras.

## Tecnologías Utilizadas

- **Node.js** (https://nodejs.org/en/docs/) 
- **Express.js** (https://expressjs.com/)
- **File System (fs)**
- **JSON**

## Endpoints

### /api/products

1. **GET /api/products/**

   Devuelve la lista completa de productos.

   *Ejemplo en Postman: GET http://localhost:8080/api/products*

2. **GET /api/products/:pid**

   Devuelve el producto con el ID proporcionado.

3. **POST /api/products/**

   Agrega un nuevo producto. Los campos obligatorios en el cuerpo de la solicitud son:

   - `title`: String
   - `description`: String
   - `code`: String
   - `price`: Number
   - `status`: Boolean
   - `stock`: Number
   - `category`: String
   - `thumbnails`: Array de Strings (opcional)

   **Ejemplo**:
   ```json
   {
     "title": "Producto",
     "description": "Descripción del producto",
     "code": "12345",
     "price": 150,
     "status": true,
     "stock": 50,
     "category": "Perfumería",
     "thumbnails": ["ruta_imagen1.jpg"]
   }

4. **PUT /api/products/:pid**

    Actualiza un producto existente con los datos proporcionados. El ID del producto no debe cambiar. Los campos que se pueden actualizar son:

    `title`, `description`, `code`, `price`, `status`, `stock`, `category` y `thumbnails`.

5. **DELETE /api/products/:pid**

    Elimina un producto con el ID proporcionado. Si no se encuentra el producto, se responde con un error 404.


### /api/carts

1. **POST /api/carts/**
   
   Crea un nuevo carrito de compras. El carrito será un objeto con un ID autogenerado y un array vacío de productos.

   Ejemplo de respuesta:
   ```json
   {
     "id": 1,
     "products": []
   }

*Ejemplo en Postman: POST http://localhost:8080/api/carts*


2. **GET /api/carts/:cid**
   
   Devuelve el carrito con el ID proporcionado. En la respuesta, se incluye un array de productos en el carrito.

   *Ejemplo en Postman: GET http://localhost:8080/api/carts/1*

3. **POST /api/carts/:cid/product/:pid**
    Agrega un producto al carrito. Si el producto ya está presente en el carrito, incrementa su cantidad en 1. Si no, agrega el producto con una cantidad de 1.

    Ejemplo de cuerpo de solicitud:
    ```json
    {
        "quantity": 1
    }

*Ejemplo en Postman: POST http://localhost:8080/api/carts/1/product/1*

4. **DELETE /api/carts/:cid**
    Elimina un carrito con el ID proporcionado. Si no se encuentra el carrito, responde con un error 404.