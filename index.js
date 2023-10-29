const express = require('express');
const app = express();
const port = 8080;

//constantes jwt y dotenv
const jwt =require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config();

//Los usuarios 
const usuarios = [
  { username: 'usuario1', password: 'contrasena1' },
  { username: 'usuario2', password: 'contrasena2' },
];

app.use(express.json());


const jwtSecret = process.env.JWT_SECRET;

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  //verificar las credenciales del usuario
  const usuario = usuarios.find((user) => user.username === username && user.password === password);
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales incorrectas'});
  }

  //Generar el token JWT
  const token = jwt.sign({ username}, jwtSecret, { expiresIn: '1h'});
  //console.log("Generated token:", token);
  res.json({ token });
});


//Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.get("Authorization")

  if (!token) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  const tokenWithoutBearer = token.replace("Bearer ", "");

  jwt.verify(tokenWithoutBearer, jwtSecret, (error, decoded) => {
    if (error) {
      res.status(401).json({ error: 'Token invalido' });
      return;
    }
    req.user = decoded;  // Agrega el usuario autenticado a la solicitud para su posterior uso
    next();
  });
  /*console.log(token);
  console.log(jwt.verify(token, jwtSecret));*/
}

//Ruta protegida con el middleware verifyToken
app.post('/rutaProtegida', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Ruta protegida' });
});




//constantes para los routers
const listViewRouter = require('./list-edit-router');
const listEditRouter = require('./list-edit-router');

// Middleware de aplicacion para validar metodos http validos
const validateHTTPMethods = (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE'){
    res.status(405).send('Metodo HTTP no permitido');
  }else{
    next();
  }
};

app.use(validateHTTPMethods)

///ruta para obtener la lista de tareas en formato JSON
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

//rutas para llamar el post con body
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Agregar los routers a las rutas principales
//middlewares
app.use('/list-view', listViewRouter);
app.use('/list-edit', listEditRouter);

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});


const tasks = [];

module.exports = { tasks };
