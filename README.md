 Books API
Este proyecto es una API REST desarrollada para el trabajo práctico de la Clase 15. Está construida utilizando Node.js, Express y TypeScript.

##Tecnologías utilizadas
* Node.js: Entorno de ejecución para JavaScript.
* TypeScript: Superconjunto de JavaScript que añade tipado estático.
* Express: Framework para el manejo de rutas y servidores.
* Nodemon & ts-node: Herramientas para el desarrollo fluido en TypeScript.

## Instalación y Ejecución

Para poder probar este proyecto de forma local, seguí estos pasos:

1. Clonar el repositorio.
2. Instalar las dependencias: npm install
3. Iniciar el servidor: npm run dev

El servidor se iniciará por defecto en: http://localhost:3000

## Endpoints Principales

La API cuenta con las siguientes rutas configuradas:

GET /books: Devuelve el listado completo de libros almacenados.
POST /books: Permite agregar un nuevo libro enviando los datos correspondientes en el cuerpo (body) de la petición.
PUT /books/:id: Actualiza los datos de un libro existente.
DELETE /books/:id: Elimina un libro del sistema.

## Configuración del Proyecto
El código fuente se encuentra dentro de la carpeta /src.
La configuración de TypeScript está definida en el archivo tsconfig.json.
Las dependencias y scripts de ejecución están gestionados en el archivo package.json.
