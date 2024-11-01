// Paquetes instalados: -g nodemon, express, body-parser, mysql2, socket.io
// Agregado al archivo "package.json" la línea --> "start": "nodemon index"

// Proyecto "Node_base"
// Desarrollo de Aplicaciones Informáticas - Proyecto de Producción - 5to Informática

// Docentes: Nicolás Facón, Matías Marchesi, Martín Rivas

// Revisión 5 - Año 2024

// Cargo librerías instaladas y necesarias
const express = require('express');						// Para el manejo del web server
const bodyParser = require('body-parser'); 				// Para el manejo de los strings JSON
const MySQL = require('./modulos/mysql');				// Añado el archivo mysql.js presente en la carpeta módulos
const session = require('express-session');				// Para el manejo de las variables de sesión
const cors = require('cors');

const datosUsuarios = {actualProfesor: "", actualStudent: "", listoProfesor: false, listoAlumno: false}

const app = express();                                  // Inicializo express para el manejo de las peticiones

app.use(cors());            							// Inicializo express para el manejo de las peticiones

app.use(bodyParser.urlencoded({ extended: false }));	// Inicializo el parser JSON
app.use(bodyParser.json());

const LISTEN_PORT = 4000;								// Puerto por el que estoy ejecutando la página Web

const server = app.listen(LISTEN_PORT, () => {
	console.log(`Servidor NodeJS corriendo en http://localhost:${LISTEN_PORT}/`);
});;

const io = require('socket.io')(server, {
	cors: {
		// IMPORTANTE: REVISAR PUERTO DEL FRONTEND
		origin: ['http://localhost:3000',"http://localhost:3001"],            	// Permitir el origen localhost:3000
		methods: ["GET", "POST", "PUT", "DELETE"],  	// Métodos permitidos
		credentials: true                           	// Habilitar el envío de cookies
	}
});

const sessionMiddleware = session({
	//Elegir tu propia key secreta
	secret: "supersarasa",
	resave: false,
	saveUninitialized: false
});

app.use(sessionMiddleware);

io.use((socket, next) => {
	sessionMiddleware(socket.request, {}, next);
});

// A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
// A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
// A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
// A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
// A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
// A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
// A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
// A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
// A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)<

app.get('/', (req, res) => {
	console.log(`[REQUEST - ${req.method}] ${req.url}`);
});

app.post('/getUser', async function(req,res) {
	const username = req.body.username
	const result = await MySQL.realizarQuery(`SELECT * FROM Users WHERE username = "${username}";`);
	res.send(result);
});

app.post('/login', async function(req,res) {
	const username = req.body.username
	const password = req.body.password
	const result = await MySQL.realizarQuery(`SELECT * FROM Users WHERE username = "${username}" AND password = "${password}";`);
	if (result === undefined || result.length === 0){
		res.send({message: "Usuario o contraseña incorrecta"})
	} else {
		res.send({user: result, message: "Inicio de sesión correcto"});
		console.log(result)
	}
});

app.post('/register', async function(req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const result = await MySQL.realizarQuery(`INSERT INTO Users (username, password)
	VALUES ("${username}", "${password}")`);
	const result2 = await MySQL.realizarQuery(`SELECT * FROM Users WHERE username = "${username}";`)
	if (result2 === undefined || result2.length === 0){
		res.send({message: 'Hubo un error al seleccionar el usuario'});
	} else {
		res.send({message: 'Usuario agregado a la tabla', user: result2});
	}
	console.log(result2)
});

io.on("connection", (socket) => {
	const req = socket.request;

	socket.on('joinRoom', data => {
		console.log("🚀 ~ io.on ~ req.session.room:", req.session.room)
		if (req.session.room != undefined && req.session.room.length > 0)
			socket.leave(req.session.room);
		req.session.room = data.room;
		socket.join(req.session.room);

		io.to(req.session.room).emit('chat-messages', { user: req.session.user, room: req.session.room });
	});

	socket.on('leaveRoom', data => {
		req.session.room = data.room;
		socket.leave(req.session.room)
	})

	socket.on('pingAll', data => {
		console.log("PING ALL: ", data);
		if (data.actualProfesor){
			datosUsuarios.actualProfesor = data.actualProfesor
			console.log(datosUsuarios)
		}
		if (data.actualStudent){
			datosUsuarios.actualStudent = data.actualStudent
			console.log(datosUsuarios)
		}
		io.emit('pingAll', { event: "Ping to all", message: data });
	});

	socket.on('pingListo', data => {
		console.log("PING LISTO: ", data);
		if (data != undefined){
			if (data.listoProfesor){
				datosUsuarios.listoProfesor = data.listoProfesor
				console.log(datosUsuarios)
			}
			if (data.listoAlumno){
				datosUsuarios.listoAlumno = data.listoAlumno
				console.log(datosUsuarios)
			}
			if (data.inicioPartida){
				datosUsuarios.actualProfesor = ""
				datosUsuarios.actualStudent = ""
				datosUsuarios.listoProfesor = ""
				datosUsuarios.listoAlumno = ""
				return
			}
			io.emit('pingListo', { event: "Ping to listo", info: datosUsuarios });
		}
	});

	socket.on('disconnect', () => {
		console.log("Disconnect");
	})
});