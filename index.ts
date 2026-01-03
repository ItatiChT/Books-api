
import express from 'express';
import type { Request, Response, NextFunction } from 'express'; 
import cors from 'cors'; //permite que se pueda acceder a la API desde otros lados, por ejemplo  postman.
import fs from 'fs';

const app = express();
const PORT = 3000;
const DB_FILE = './database.json'; //ruta del archivo que simula la base de datos.

// 1. MIDDLEWARES

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("Middleware global: se recibió una solicitud"); //Es lo que se ejecuta en todas las solicitudes: registra en esta terminal que llegó una solicitud.
    next(); //permite que la ejecución continúe hacia el endpoint correspondiente
});

app.use(express.json());
app.use(cors()); //Permite que cualquier cliente pueda acceder a la API

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];//Autenticacion, lee y evalua el token 
    if (token === "123456") {
        next();
    } else {
        res.status(401).json({ message: "Token inválido o ausente" });
    }
};

//  2. FUNCIONES DE BASE DE DATOS 
//lee el archivo database.json y lo convierte de texto a objeto JS 
const leerDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
//para guardar datos actualizados
const escribirDB = (data: any) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

//  3. ENDPOINTS (API REST) 

// LISTAR Y FILTRAR
app.get('/books', (req: Request, res: Response) => {
    const libros = leerDB();//trae los libros
    const { author } = req.query;//lee autor como parametro

    if (author) {
        // Si aparece autor, filtramos por autor. 
        const autorBuscado = String(author).toLowerCase();//Forzamos que sea un string
        const filtrados = libros.filter((l: any) => 
            l.autor.toLowerCase().includes(autorBuscado)
        );
        return res.status(200).json(filtrados); 
    }
    res.status(200).json(libros);
});

// DETALLE POR ID
app.get('/books/:id', (req: Request, res: Response) => {
    const libros = leerDB();
    //  pasamos el ID a String antes de pasarlo a parseInt
    const idABuscar = parseInt(String(req.params.id));
    
    const libro = libros.find((l: any) => l.id === idABuscar);
    if (!libro) return res.status(404).json({ message: "Diculpe, el libro no fue encontrado. Revise errores e intente de otra forma" });
    res.status(200).json(libro);
});

// CREAR LIBRO (Usamos autenticacion)
app.post('/books', authMiddleware, (req: Request, res: Response) => {
    const libros = leerDB();
    const nuevo = { id: Date.now(), ...req.body }; //genera un ID nuevo y unico, toma los datos del body
    libros.push(nuevo);
    escribirDB(libros);
    res.status(201).json(nuevo);
});

// ACTUALIZAR LIBRO (Usamos autenticacion)
app.put('/books/:id', authMiddleware, (req: Request, res: Response) => {
    let libros = leerDB();
    //Pasamos  el ID a String
    const idAActualizar = parseInt(String(req.params.id));
    const index = libros.findIndex((l: any) => l.id === idAActualizar); //busca la posicion del libro en el array
    
    if (index === -1) return res.status(404).json({ message: "Disculpe, ID no valido" });
    
    libros[index] = { ...libros[index], ...req.body }; //mantiene los libros que ya teniamos, y actualiza solo lo del body
    escribirDB(libros);
    res.status(200).json(libros[index]);
});

// ELIMINAR LIBRO (Usamos autenticacion)
app.delete('/books/:id', authMiddleware, (req: Request, res: Response) => {
    let libros = leerDB();
    const idAEliminar = parseInt(String(req.params.id));
    const filtrados = libros.filter((l: any) => l.id !== idAEliminar); //filtra el libro y lo elimina, actualiza el nuevo array
    escribirDB(filtrados);
    res.status(200).json({ message: "El libro ha sido eliminado correctamente" });
});

// 4. MANEJO DE ERRORES 
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ status: "error", message: err.message });//captura errores globales
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`)); //inicia la API en el puerto 3000