# Proyecto: E-commerce
Sistema de e-commerce con arquitectura en capas, gestión de productos, carritos, tickets de compra, mailing y autenticación JWT. Todos los usuarios (role user y admin) pueden visualizar su perfil, donde pueden cerrar sesión y ver sus datos de registro. Los usuarios con rol user pueden agregar y eliminar productos a su carrito y visualizarlo, además de visualizar el total de su compra y agregar o eliminar cantidad de productos por unidad.

## Características Principales

### Arquitectura y Patrones
- **Arquitectura en capas** (Controller-Service-DAO)
- **Patrón Repository** para la lógica de negocio
- **DTOs** para transferencia de datos segura
- **DAO** para abstracción de persistencia

### Seguridad y Accesos
- **JWT Authentication** con Passport
- **Roles**: Admin (CRUD productos) / User (gestión carrito)
- **Variables de entorno** para configuración sensible
- **Bcrypt** para hashing de contraseñas

### Gestión de Productos
- CRUD (solo para administradores - role: admin) Se permite actualizar el stock desde Productos en tiempo real.
- Filtrado (categoría, precio asc. y desc.)

### Carritos y Compras
- Gestión de carritos por usuario
- **Sistema de Tickets** para compras:
  - Código único autogenerado
  - Fecha/hora exacta de compra
  - Total calculado automáticamente
  - Validación de stock en tiempo real


### Mailing
- Envío automático de tickets al finalizar compra al e-mail del comprador.
- Plantillas profesionales con detalles de compra.

## 🔧 Configuración del Proyecto

### Requisitos Previos
- Node.js
- MongoDB Atlas (o local)
- Postman para testing

### Instalación

**1. Clonar el repositorio**

**2. Instalar las dependencias**

**3. Configurar la conexión a MongoDB**
Este proyecto utiliza una base de datos en *MongoDB Atlas*.
Se debe *crear un archivo .env* con la *URI de conexión* y el *JWT_SECRET* enviados por mensaje privado (al ser credenciales sensibles, no se subirán al repositorio) para testear las funcionalidades del proyecto, ya que este usuario *permite la lectura y escritura de la DB*.
Además, se otorga *acceso por privado* al usuario *ADMIN* para testear el *CRUD* de la DB.

Además, la base de datos está configurada para permitir el acceso desde cualquier IP (0.0.0.0/0), por lo que *no es necesario configurar IPs específicas*.

**4. Iniciar el servidor**

## API Endpoints  

### Postman: Cómo probar los endpoints
Descargar la colección desde *[postman/collections/E-commerce Mocks.postman_collection.json]* e importarla en Postman.

#### GET Mock Users
GET http://localhost:8080/api/mocks/mockingusers

**¿Qué hace?:**
Genera 50 usuarios mock en memoria.
Cada usuario tiene el mismo formato que un documento de MongoDB:
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0",  // ID ficticio
  "password": "$2b$10$...",         // "coder123" encriptado
  "role": "user",                   // "user" o "admin" aleatorio
  "pets": []                        // Array vacío
}

#### POST Generate Data
POST http://localhost:8080/api/mocks/generateData
Body - raw (JSON):  
{  
  "users": 2,  
  "pets": 1  
}

**¿Qué hace?:**
Inserta en la base de datos usuarios y mascotas mock según las cantidades especificadas.
Los usuarios generados tienen:
-Contraseña encriptada (coder123).
-Rol aleatorio (user o admin).
-Array de mascotas vacío (pets: []).
-Las mascotas generadas tienen datos aleatorios (nombre, tipo, etc.).


## 🛠 Tecnologías Utilizadas

**Node.js** (https://nodejs.org/en/docs/) 
**Express** (https://expressjs.com/)
**MongoDB** (https://www.mongodb.com/docs/)
**Mongoose** (https://mongoosejs.com/)
**Socket.io** (https://socket.io/docs/v4/)
**Handlebars** (https://handlebarsjs.com/)
**JWT** (https://auth0.com/docs/secure/tokens/json-web-tokens)
**Passport.js** (https://www.passportjs.org/docs/)
**bcrypt** (https://www.npmjs.com/package/bcrypt)
**Nodemailer** (https://www.nodemailer.com/)
**@faker-js/faker** (https://fakerjs.dev/)