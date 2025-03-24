# Proyecto: Sistema de Manejo de Productos y Carrito de Compras

Este proyecto es un sistema de manejo de productos y carritos de compras desarrollado con **Node.js**, **Express**, **MongoDB** y **Mongoose**. Incluye gestión de productos y carritos, con funcionalidades avanzadas como paginación, filtrado y ordenamiento según precio ascendente o descendente. Se integró la visualización en tiempo real de los productos usando **Websockets** y **Handlebars**, además de un Register, Login y Perfil de usuario donde se les permite a los usuarios cerrar sesión.

## Características:

- Persistencia en MongoDB: Los datos de productos y carritos se almacenan en una base de datos MongoDB en la nube.

- Endpoints para gestionar productos y carritos.

- Consultas con ordenamiento y filtros.

- Gestión de Carritos: Agregar, eliminar y actualizar productos en carritos.

- Vistas en Tiempo Real: Interfaz de usuario dinámica con actualización en tiempo real usando Websockets. Posibilidad de quitar y/o agregar productos en tiempo real desde la web.

- Vistas con Handlebars: Renderizado de productos y carritos.

- Validación de campos y hashing de contraseñas con bcrypt.

- Persistencia de sesión con JWT (JSON Web Tokens).

- Sistema de Roles: Rol user (usuario normal) y admin (acceso total, se agregará posteriormente). Vistas condicionales según rol (ej: solo user ve su perfil). Rutas protegidas con Passport JWT Strategy.


## Tecnologías Utilizadas

- **Node.js** (https://nodejs.org/en/docs/) 
- **Express.js** (https://expressjs.com/)
- **MongoDB** (https://www.mongodb.com/docs/)
- **Mongoose** (https://mongoosejs.com/)
- **Socket.io** (https://socket.io/docs/v4/)
- **Handlebars** (https://handlebarsjs.com/)
- **JWT** (https://auth0.com/docs/secure/tokens/json-web-tokens)
- **Passport.js** (https://www.passportjs.org/docs/)
- **bcrypt** (https://www.npmjs.com/package/bcrypt)

## Configuración del Proyecto
### Requisitos Previos

- Node.js instalado.

- MongoDB instalado o una cuenta en MongoDB Atlas.

- Postman (para probar los endpoints de la API).

- Dependencias instaladas.

### Instalación

**1. Clonar el repositorio**

**2. Instalar las dependencias**

**3. Configurar la conexión a MongoDB**
Este proyecto utiliza una base de datos en *MongoDB Atlas*.
Se debe *crear un archivo .env* con la *URI de conexión* y el *JWT_SECRET* enviados por mensaje privado (al ser credenciales sensibles, no se subirán al repositorio) para testear las funcionalidades del proyecto, ya que este usuario *permite la lectura y escritura de la DB*.

Además, la base de datos está configurada para permitir el acceso desde cualquier IP (0.0.0.0/0), por lo que *no es necesario configurar IPs específicas*.

**4. Iniciar el servidor**


## Rutas y Endpoints

**1. /realtimeproducts** Vista en tiempo real de los productos. Cada vez que se agrega o elimina un producto, la vista se actualiza automáticamente usando Websockets.

- Esta ruta permite la visualización de productos y la interacción en tiempo real (agregar/eliminar productos).
- La vista se carga utilizando el motor de plantillas Handlebars.
- Para agregar un producto, se utiliza un formulario, y para eliminarlo, un botón "Eliminar" está disponible junto a cada producto.

**2. /products** Lista de todos los productos.

- Visualiza todos los productos a través de una solicitud HTTP (GET).
- La vista utiliza Handlebars para renderizar los productos.

**3. /carts/:cid** Muestra los productos de un carrito específico.
- Permite eliminar productos en total o de a 1.


### Endpoints de la API (HTTP)

#### Postman Collections

Se pueden encontrar las colecciones de Postman para probar los endpoints de la API en la carpeta `postman/collections`.

#### /api/products

1. **GET /api/products/**

   Devuelve la lista completa de productos.

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
   - `thumbnail`: String


4. **PUT /api/products/:pid**

   Actualiza un producto existente con los datos proporcionados. El ID del producto no debe cambiar. Los campos que se pueden actualizar son:

   `title`, `description`, `code`, `price`, `status`, `stock`, `category` y `thumbnail`.

5. **DELETE /api/products/:pid**

   Elimina un producto con el ID proporcionado. Si no se encuentra el producto, se responde con un error 404.


#### /api/carts

1. **POST /api/carts/**
   
   Crea un nuevo carrito de compras. El carrito será un objeto con un ID autogenerado y un array vacío de productos.


2. **GET /api/carts/:cid**
   
   Devuelve el carrito con el ID proporcionado.


3. **POST /api/carts/:cid/product/:pid**
   Agrega un producto al carrito.


4. **DELETE /api/carts/:cid**
   Elimina todos los productos de un carrito con un ID específico.

5. **PUT /api/carts/:cid**
   Actualiza el carrito con un nuevo arreglo de productos.

6. **PUT /api/carts/:cid/products/:pid**
   Actualiza la cantidad de un producto en el carrito.