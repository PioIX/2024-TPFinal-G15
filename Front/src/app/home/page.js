"use client"
import InputLogin from "@/components/InputLogin";
import Profesor from "@/components/Profesor";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import styles from "./page.module.css";
import Mapa from "@/components/Mapa";
import Title from "@/components/Title";

export default function home() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [actualUser, setActualUser] = useState([]);
    const [selectProfesor, setSelectProfesor] = useState(false);

    async function register() {
        if (username != undefined && username != "" && password != undefined && password != "") {
            const data = {
                username: username,
            }

            const response = await fetch('http://localhost:4000/getUser', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result === undefined || result.length === 0) {
                const data1 = {
                    username: username,
                    password: password
                }

                const response1 = await fetch('http://localhost:4000/register', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data1),
                });

                const result1 = await response1.json();


                if (result1 != undefined || result1.length != 0) {
                    setActualUser([result1.user[0].userId, result1.user[0].username])
                    alert("Registro realizado correctamente")
                    setUsername("")
                    setPassword("")
                    setSelectPlayer(true)
                }
            } else {
                console.log(result)
                alert("El usuario ya existe")
            }
        } else {
            alert("Complete la información")
        }
    }

    async function login() {
        if (username != "" && password != "") {
            const data = {
                username: username,
                password: password
            }

            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Error en la respuesta de la red');
            const result = await response.json();

            if (result.user) {
                setActualUser([result.user[0].userid, result.user[0].username])
                alert("Inicio de sesión correcto")
                setUsername("")
                setPassword("")
                setSelectPlayer(true)
            } else {
                alert(result.message)
            }
        } else {
            alert("Complete la información")
        }
    }

    function closeSession() {
        setGame(true)
        setXProfesor(4)
        setYProfesor(5)
        setXStudent(92)
        setYStudent(84)
        setContador(false)
        setListoProfesor(false)
        setListoAlumno(false)
        setActualUser([])
        setUserPlayer("")
        setMapaSeleccionado(0)
        setSeconds(180)
        setPlaying(false)
        setActualStudent()
        setActualProfesor()
    }

    function startAgain() {
        setXProfesor(4)
        setYProfesor(5)
        setXStudent(92)
        setYStudent(84)
        setGame(true)
        setSelectPlayer(true)
        setContador(false)
        setListoProfesor(false)
        setListoAlumno(false)
        setUserPlayer("")
        setMapaSeleccionado(0)
        setSeconds(180)
        setPlaying(false)
        setActualStudent()
        setActualProfesor()
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    
    const [seconds, setSeconds] = useState(0); // 3 minutos en segundos
    const [contador, setContador] = useState(false)
    const [profesores, setProfesores] = useState([{ name: "Marche", description: "Bondadoso" }, { name: "Facón", description: "Experto en desaprobar alumnos" }, { name: "Rivi", description: "Paciente" }, { name: "Brenda", description: "Experta en Ubuntu" }, { name: "Santi", description: "Pecho frio" }, { name: "Feli", description: "The BOSS" }, { name: "Belu", description: "Chusma" }, { name: "Damatto", description: "Ecologista" }, { name: "Ana", description: "Ama poner partes" }, { name: "Caro Bruno", description: "Gallina" }, { name: "Pablito", description: "Se hace el gorra" }, { name: "Chela", description: "Jardinera" }, { name: "Naddeo", description: "Pruebas más dificiles" }])
    const [alumnos, setAlumnos] = useState([{ name: "Maraval", description: "Pelado insoportable." }, { name: "Lujan", description: "Experta en quejas" }, { name: "Tomi", description: "Pollera" }, { name: "Cachete", description: "Traga" }, { name: "Mica", description: "Gimnasta" }, { name: "May", description: "Gei" }, { name: "Candela", description: "Ex comu" }, { name: "Lucas", description: "Judio" }, { name: "Juan", description: "Golpeado" }, { name: "Agus", description: "El primo" }, { name: "Tomi Beli", description: "Anti Pala" }])
    const [mapas, setMapas] =useState (["Fondo Gris", "Fondo Cancha", "Fondo Espacio", "Fondo Maria", "Fondo Montaña", "Fondo Playa", "Fondo Selva", "Pitufialdea", "Mar"])
    const [profesorSeleccionado, setProfesorSeleccionado] = useState(0)
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(0)
    const [mapaSeleccionado, setMapaSeleccionado] = useState (0)
    const [actualProfesor, setActualProfesor] = useState()
    const [actualStudent, setActualStudent] = useState()
    const [selectPlayer, setSelectPlayer] = useState(false)
    const [selectStudent, setSelectStudent] = useState(false)
    const [userPlayer, setUserPlayer] = useState("")
    const [selectMap, setSelectMap] = useState (false)
    const [finalText, setFinalText] = useState("")
    const [playerPoints, setPlayerPoints] = useState(0)
    const [listPlayers, setListPlayers] = useState([])

    const [xPositionProfesor, setXProfesor] = useState(4);
    const [xPositionStudent, setXStudent] = useState(92);
    const [yPositionProfesor, setYProfesor] = useState(5);
    const [yPositionStudent, setYStudent] = useState(84);
    const [listo, setListo] = useState(false)
    const [listoProfesor, setListoProfesor] = useState(false);
    const [listoAlumno, setListoAlumno] = useState(false);

    const [keyState, setKeyState] = useState({});
    const [game, setGame] = useState(true);
    const [playing, setPlaying] = useState(false)
    
    function handleContador() {
        setContador(true)
    }

    const handleKeyDown = (event) => {
        //console.log(event.key); // Para depurar
        if (event.key === 'ArrowRight') {
            handleRight();
        } else if (event.key === "ArrowLeft") {
            handleLeft()
        } else if (event.key === "Enter" && actualUser != "") {
            if (selectProfesor === true) {
                changeSelectProfesor()}
            else if (selectMap === true) {
                changeSetSelectMap()
            } else {
                changeSelectStudent()
            }
        }
    };

    useEffect(() => {
        if (selectProfesor === true || selectStudent === true || selectMap === true) {
            // Añadir el evento al montar el componente
            window.addEventListener('keydown', handleKeyDown);
        }

        // Limpiar el evento al desmontar
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [profesorSeleccionado, selectProfesor, selectStudent, alumnoSeleccionado, selectMap, mapaSeleccionado]);

    const handleKeyDown1 = (event) => {
        setKeyState((prev) => ({
            ...prev,
            [event.key]: true,
        }));
    };

    const handleKeyUp = (event) => {
        setKeyState((prev) => ({
            ...prev,
            [event.key]: false,
        }));
    };

    const handleMovement = (player) => {
        // Condición para definir si el profesor está fuera de la primera pared

        function pared(xpos, ypos, dir){
            const paredes = [
                {xmin: 19, xmax: 49, ymin: 22, ymax: 26, dir: "arriba", name: "arriba izquierda"},
                {xmin: 14, xmax: 49, ymin: 11, ymax: 13, dir: "abajo", name: "arriba izquierda2"},
                {xmin: 56, xmax: 78, ymin: 22, ymax: 26, dir: "arriba", name: "arriba derecha"},
                {xmin: 56, xmax: 82, ymin: 11, ymax: 13, dir: "abajo", name: "arriba derecha2"},
                {xmin: 23, xmax: 53, ymin: 72, ymax: 76, dir: "arriba", name: "abajo izquierda"},
                {xmin: 23, xmax: 58, ymin: 62, ymax: 64, dir: "abajo", name: "abajo izquierda2"},
                {xmin: 65, xmax: 82, ymin: 72, ymax: 76, dir: "arriba", name: "abajo derecha"},
                {xmin: 65, xmax: 82, ymin: 62, ymax: 64, dir: "abajo", name: "abajo derecha2"},
                {xmin: 17, xmax: 19, ymin: 14, ymax: 74, dir: "izquierda", name: "izquierda"},
                {xmin: 14, xmax: 16, ymin: 14, ymax: 74, dir: "derecha", name: "izquierda2"},
                {xmin: 81, xmax: 83, ymin: 14, ymax: 30, dir: "izquierda", name: "derecha arriba"},
                {xmin: 77, xmax: 79, ymin: 14, ymax: 30, dir: "derecha", name: "derecha arriba2"},
                {xmin: 81, xmax: 83, ymin: 40, ymax: 75, dir: "izquierda", name: "derecha abajo"},
                {xmin: 77, xmax: 79, ymin: 40, ymax: 75, dir: "derecha", name: "derecha abajo2"},
                {xmin: 48, xmax: 50, ymin: 6, ymax: 25, dir: "izquierda", name: "barrera arriba"},
                {xmin: 44, xmax: 46, ymin: 6, ymax: 25, dir: "derecha", name: "barrera arriba2"},
                {xmin: 26, xmax: 28, ymin: 57, ymax: 75, dir: "izquierda", name: "barrera abajo izquierda"},
                {xmin: 23, xmax: 25, ymin: 57, ymax: 75, dir: "derecha", name: "barrera abajo izquierda2"},
                {xmin: 57, xmax: 59, ymin: 63, ymax: 83, dir: "izquierda", name: "barrera abajo derecha"},
                {xmin: 53, xmax: 55, ymin: 75, ymax: 83, dir: "derecha", name: "barrera abajo derecha2"},
                {xmin: 55, xmax: 57, ymin: 13, ymax: 24, dir: "derecha", name: "marco1"},
                {xmin: 78, xmax: 82, ymin: 30, ymax: 32, dir: "arriba", name: "marco2"},
                {xmin: 78, xmax: 82, ymin: 38, ymax: 40, dir: "abajo", name: "marco3"},
                {xmin: 63, xmax: 65, ymin: 63, ymax: 75, dir: "derecha", name: "marco4"},
                {xmin: 54, xmax: 58, ymin: 82, ymax: 84, dir: "arriba", name: "marco5"},
                {xmin: 24, xmax: 27, ymin: 55, ymax: 57, dir: "abajo", name: "marco6"},
                {xmin: 14, xmax: 18, ymin: 74, ymax: 76, dir: "arriba", name: "marco7"},
                {xmin: 45, xmax: 49, ymin: 4, ymax: 6, dir: "abajo", name: "marco8"},
            ]
            for (let x in paredes){
                //console.log(x)
                if (((xpos < paredes[x].xmin || xpos > paredes[x].xmax) || (ypos < paredes[x].ymin || ypos > paredes[x].ymax)) === false && paredes[x].dir === dir){
                    return ((xpos < paredes[x].xmin || xpos > paredes[x].xmax) || (ypos < paredes[x].ymin || ypos > paredes[x].ymax))
                }
            }
            return true
        }

        if (keyState['W'] || keyState['w']) {
            if (player === "profesor") {
                // Verifica si el personaje está fuera de los límites de la pared en X o Y para permitir el movimiento
                if (pared(xPositionProfesor, yPositionProfesor, "arriba")) {
                    if (yPositionProfesor - 2 >= 0) {
                        setYProfesor(yPositionProfesor - 2);
                    } else if (yPositionProfesor - 1 >= 0) {
                        setYProfesor(yPositionProfesor - 1);
                    }
                }
            } else if (player == "student") {
                if (pared(xPositionStudent, yPositionStudent, "arriba")){
                    if (yPositionStudent - 2 >= 0 ) {
                        setYStudent(yPositionStudent - 2);
                    } else if (yPositionStudent - 1 >= 0) {
                        setYStudent(yPositionStudent - 1)
                    }
                }
            }
        }
        
        if (keyState['A'] || keyState['a']){
            if (player == "profesor") {
                if (pared(xPositionProfesor, yPositionProfesor, "izquierda")){
                    if (xPositionProfesor - 1 >= 0) {
                        setXProfesor(xPositionProfesor - 1)
                    }
                }
            } else if (player == "student") {
                if (pared(xPositionStudent, yPositionStudent, "izquierda")){
                    if (xPositionStudent - 1 >= 0) {
                        setXStudent(xPositionStudent - 1)
                    }
                }
            }
        }
        if (keyState['S'] || keyState['s']) {
            if (player == "profesor") {
                if (pared(xPositionProfesor, yPositionProfesor, "abajo")){
                    if (yPositionProfesor + 2 < 100 - 11) {
                        setYProfesor(yPositionProfesor + 2)
                    } else if (yPositionProfesor + 1 < 100 - 11){
                        setYProfesor(yPositionProfesor + 1)
                    }
                }
            } else if (player == "student") {
                if (pared(xPositionStudent, yPositionStudent, "abajo")) {
                    if (yPositionStudent + 2 < 100 - 11) {
                        setYStudent(yPositionStudent + 2)
                    } else if (yPositionStudent + 1 < 100 - 11){
                        setYStudent(yPositionStudent + 1)
                    }
                }
            }
        }
        if (keyState['D'] || keyState['d']) {
            if (player == "profesor") {
                if (pared(xPositionProfesor, yPositionProfesor, "derecha")){
                    if (xPositionProfesor + 1 < 100 - 4) {
                    setXProfesor(xPositionProfesor + 1)
                    }
                }
            } else if (player == "student") {
                if (pared(xPositionStudent, yPositionStudent, "derecha")){
                    if (xPositionStudent + 1 < 100 - 4) {
                        setXStudent(xPositionStudent + 1)
                    }
                }
            }
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown1);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown1);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    
    

    useEffect(() => {
        if (game === true){
            handleMovement(userPlayer);

            //console.log(keyState)
        }
    }, [keyState, userPlayer, game]);

    function handleRight() {
        if (selectProfesor == true) {
            if (profesores.length - 1 != profesorSeleccionado) {
                setProfesorSeleccionado(profesorSeleccionado + 1)
            } else {
                setProfesorSeleccionado(0)
            }
        }
        else if (selectMap == true) {
            console.log(mapaSeleccionado)
            if (mapas.length - 1 != mapaSeleccionado) {
                setMapaSeleccionado(mapaSeleccionado + 1)
            } else {
                setMapaSeleccionado(0)
            }
        } 
        else {
            if (alumnos.length - 1 != alumnoSeleccionado) {
                setAlumnoSeleccionado(alumnoSeleccionado + 1)
            } else {
                setAlumnoSeleccionado(0)
            }
        }
    }

    function handleLeft() {
        if (selectProfesor == true) {
            if (profesorSeleccionado > 0) {
                setProfesorSeleccionado(profesorSeleccionado - 1)
            } else {
                setProfesorSeleccionado(profesores.length - 1)
            }
        } 
        else if (selectMap == true) {
            if (mapaSeleccionado > 0) {
                setMapaSeleccionado(mapaSeleccionado - 1)
            } else {
                setMapaSeleccionado(mapas.length - 1)
            }
        } else {
            if (alumnoSeleccionado > 0) {
                setAlumnoSeleccionado(alumnoSeleccionado - 1)
            } else {
                setAlumnoSeleccionado(alumnos.length - 1)
            }
        }
    }

    function changeSelectProfesor() {
        setActualProfesor(profesores[profesorSeleccionado])
        socket.emit("pingPlayer",{
            actualProfesor: profesores[profesorSeleccionado],
            userId: actualUser[0]})
        setSelectProfesor(false)
        setProfesorSeleccionado(0)
        setSelectMap(true)
    }

    function changeSelectStudent() {
        setActualStudent(alumnos[alumnoSeleccionado])
        socket.emit("pingPlayer",{
            actualStudent: alumnos[alumnoSeleccionado],
            userId: actualUser[0]})
        setSelectStudent(false)
        setAlumnoSeleccionado(0)
        setSelectMap(true)
    }

    async function funSelectProfesor() {
        const response = await fetch('http://localhost:4000/getPlayer', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Error en la respuesta de la red');
        const result = await response.json();

        console.log(result)

        if (result.actualProfesor === "") {
            setSelectPlayer(false)
            setSelectProfesor(true)
            setUserPlayer("profesor")
        } else {
            alert("El profesor ya ha sido seleccionado")
        }
    }

    function changeSetSelectMap() {
        setSelectMap(false)
        handleContador()
        setListo(true)
        resetTimer()
    }

    async function funSelectStudent() {
        const response = await fetch('http://localhost:4000/getPlayer', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Error en la respuesta de la red');
        const result = await response.json();

        console.log(result)

        if (result.actualStudent === "") {
            setSelectPlayer(false)
            setSelectStudent(true)
            setUserPlayer("student")
        } else {
            alert("El profesor ya ha sido seleccionado")
        }
    }

    function funListo(){
        if (userPlayer === "profesor"){
            socket.emit("pingListo", {
                userId: actualUser[0],
                listoProfesor: true
            })
            setListoProfesor(true)
        }
        if (userPlayer === "student"){
            socket.emit("pingListo", {
                userId: actualUser[0],
                listoAlumno: true
            })
            setListoAlumno(true)
        }
    }

    async function logOut() {
        setActualUser("")
        setSelectProfesor(false)
        setSelectStudent(false)
        setSelectPlayer(false)
        setSelectMap(false)
        setListo(false)
        setActualProfesor()
        setActualStudent()

        const data = {
            player: userPlayer,
        }

        const response = await fetch('http://localhost:4000/logOut', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Error en la respuesta de la red');
        const result = await response.json();

        console.log(result)
    }

    async function addScore(points){
        const data = {
            puntos: points,
            userId: actualUser[0]
        }

        const response = await fetch('http://localhost:4000/addScore', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Error en la respuesta de la red');
        const result = await response.json();

        topScorers()
    }

    async function topScorers(){
        const response1 = await fetch('http://localhost:4000/topScorers', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response1.ok) throw new Error('Error en la respuesta de la red');
        const result1 = await response1.json();

        setListPlayers(result1.list)
    }

    
       
    useEffect(() => {
        if (socket && contador===true && listoAlumno === true && listoProfesor=== true) {
            socket.emit("startTimer"); // Notificar al servidor para iniciar el contador
            console.log("inicié el timer")
        }
    }, [contador, listoAlumno, listoProfesor]);    
    useEffect(() => {
        if (socket && contador===true && listoAlumno === true && listoProfesor=== true){
             // Conecta al servidor WebSocket
        

            // Escuchar actualizaciones del servidor
            socket.on("updateTimer", (time) => {
                console.log("time papus")
                setSeconds(time); // Actualizar el estado del tiempo
            });

            // Limpiar el listener al desmontar
            return () => {
                socket.off("updateTimer");
            };}
    }, [contador, listoAlumno, listoProfesor]);
    
    function resetTimer() {
    socket.emit("resetTimer")}
    




    //MARK: Contador
    /*useEffect(() => {
        if (seconds > 0 && contador === true && listoAlumno === true && listoProfesor === true) {
            const timer = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);

            return () => clearInterval(timer); // Limpiar el intervalo al desmontar
        }
    }, [seconds, contador, listoAlumno, listoProfesor]);*/

    const formatTime = (sec) => {
        const minutes = Math.floor(sec / 60);
        const remainingSeconds = sec % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };
    
    useEffect(() => {
        if (socket && userPlayer === "profesor" && actualProfesor != undefined && playing === true){
            console.log("ENTRE EN LA FUNCION PINGALL PROFESOR")
            socket.emit("pingAll",{
                xPositionProfesor: xPositionProfesor,
                yPositionProfesor: yPositionProfesor,
                userId: actualUser[0]}
            );
        }
    }, [xPositionProfesor, yPositionProfesor, userPlayer, actualProfesor, playing]);

    useEffect(() => {
        if (socket && userPlayer === "student" && actualStudent != undefined && playing === true){
            console.log("ENTRE EN LA FUNCION PINGALL ALUMNO")
            socket.emit("pingAll",{
                xPositionStudent: xPositionStudent,
                yPositionStudent: yPositionStudent,
                userId: actualUser[0]}
        );
        }
    }, [xPositionStudent, yPositionStudent, userPlayer, actualStudent, actualUser, playing]);

    useEffect(() => {
        if (socket && listoAlumno === true && listoProfesor === true){
            setPlaying(true)
            setListo(false)
            socket.emit("pingPartidaIniciada", {
                inicioPartida: true
            })
            console.log("HOLAAAAAAAAAAAAAAAAAAAAAAAA")
        }
    }, [listoProfesor, listoAlumno]);

    //MARK: Detectar si se tocan
    useEffect(() => {
        if (((xPositionProfesor + 4 < xPositionStudent || xPositionProfesor > xPositionStudent + 4) || (yPositionProfesor + 11 < yPositionStudent || yPositionProfesor > yPositionStudent + 11)) === false){
            if (userPlayer === "profesor"){
                addScore(10)
                // alert("Atrapaste al alumno")
                setPlayerPoints(10)
                setFinalText("Ganaste")
            } else {
                // alert("Te atraparon")
                setPlayerPoints(0)
                setFinalText("Perdiste")
                addScore(0)
            }
            setGame(false)
        }
    }, [xPositionProfesor, yPositionProfesor, xPositionStudent, yPositionStudent, userPlayer])
  
    //MARK: Socket
    const { socket, isConnected } = useSocket();
    
    useEffect(() => {
        if (!socket) return;

        socket.on("pingAll", (data) => {
            if (data.message.userId != actualUser[0] && userPlayer === "profesor"){
                setXStudent(data.message.xPositionStudent)
                setYStudent(data.message.yPositionStudent)
            } else if (data.message.userId != actualUser[0] && userPlayer === "student"){
                setXProfesor(data.message.xPositionProfesor)
                setYProfesor(data.message.yPositionProfesor)
            }
        });

        socket.on("pingPlayer", (data) => {
            console.log(data)
        });

        socket.on("pingListo", (data) => {
            if (userPlayer == "profesor") {
                setActualStudent(data.info.actualStudent)
                setListoAlumno(data.info.listoAlumno)
            } else if (userPlayer == "student") {
                console.log(data.info)
                setActualProfesor(data.info.actualProfesor)
                setListoProfesor(data.info.listoProfesor)
            }
        });

        return () => {
            socket.off("message")
        }
    }, [socket, isConnected, actualUser, userPlayer]);
  
    //MARK: Pagina
    return (
        <>
            {
                actualUser == "" &&
                <>
                    <div className={styles.bodyLogin}>
                        <div className={styles.login}>
                            <h2>Login</h2>
                            <h3>Usuario</h3>
                            <InputLogin type={"text"} placeholder={"Ingrese su usuario"} onChange={handleUsernameChange} value={username} />
                            <h3>Contraseña</h3>
                            <InputLogin type={"password"} placeholder={"Ingrese su contraseña"} onChange={handlePasswordChange} value={password} />
                            <div>
                                <button onClick={login}>Ingresar</button>
                                <button onClick={register}>Registrarse</button>
                            </div>
                        </div>
                    </div>
                </>
            }
            {
                selectPlayer === true &&
                <>
                    <div className={styles.bodySelectPlayer}>
                        <div className={styles.selectPlayer}>
                            <h2>¿Cómo vas a jugar?</h2>
                            <div>
                                <button onClick={funSelectProfesor}>Profesor</button>
                                <button onClick={funSelectStudent}>Alumno</button>
                            </div>
                        </div>
                    </div>
                </>
            }
            {
                selectProfesor === true &&
                <>
                <div className={styles.bodyPersonaje}>
                    <Title className={styles.title} titulo="Elegí tu personaje"/>

                        <div className={styles.bodySelectProfesor}>
                            <button onClick={handleLeft}><img src="/../../atras.png" height={"80px"} /></button>
                            <div className={styles.selectProfesor}>
                                <Profesor name={profesores[profesorSeleccionado].name} description={profesores[profesorSeleccionado].description} />
                                <div className={styles.selectProfesorDiv}>
                                    <button onClick={changeSelectProfesor}>Listo</button>
                                </div>
                            </div>
                            <button onClick={handleRight}><img src="/../../adelante.png" height={"80px"} /></button>
                        </div>

                </div>
                </>
            }
            {
                selectStudent === true &&
                <>
                <div className={styles.bodyPersonaje}>
                    <Title className={styles.title} titulo="Elegí tu personaje"/>
                    <div className={styles.bodySelectProfesor}>
                        <button onClick={handleLeft}><img src="/../../atras.png" height={"80px"} /></button>
                        <div className={styles.selectProfesor}>
                            <Profesor name={alumnos[alumnoSeleccionado].name} description={alumnos[alumnoSeleccionado].description} />
                            <div className={styles.selectProfesorDiv}>
                                <button onClick={changeSelectStudent}>Listo</button>
                            </div>
                        </div>
                        <button onClick={handleRight}><img src="/../../adelante.png" height={"80px"} /></button>
                    </div>
                </div>    
                </>
            }
            {
                selectMap === true &&
                <>
                <div className={styles.bodyPersonaje}>
                    <Title className={styles.title} titulo="Elegí el mapa"/>
                    <div className={styles.bodySelectProfesor}>
                        <button onClick={handleLeft}><img src="/../../atras.png" height={"80px"} /></button>
                        <div className={styles.selectProfesor}>
                            <Mapa name={mapas[mapaSeleccionado]} />
                            <div className={styles.selectProfesorDiv}>
                                <button onClick={changeSetSelectMap}>Listo</button>
                            </div>
                        </div>
                        <button onClick={handleRight}><img src="/../../adelante.png" height={"80px"} /></button>
                    </div>
                </div>    
                </>
            }
            {
                listo === true &&
                <>
                    <div className={styles.bodySelectProfesor}>
                        <div className={styles.selectProfesor}>
                            <h2>¿Estás listo?</h2>
                            {
                                ((listoProfesor === true && listoAlumno === false) || (listoProfesor === false && listoAlumno === true))  &&
                                <p>Falta que alguno ponga listo</p>
                            }
                            <div className={styles.selectProfesorDiv}>
                                <button onClick={funListo}>Listo</button>
                            </div>
                        </div>
                    </div>
                </>
            }
            {
                actualUser != "" && selectProfesor == false && selectStudent == false && selectPlayer == false && selectMap == false && listo == false &&
                <>
                    <div style={{backgroundImage: `url('/${mapas[mapaSeleccionado]}.jpg')`}} className={styles.body}>
                        <div className={styles.topbar}>
                            <div>
                                <h1>Contador: {formatTime(seconds)}</h1>
                                {seconds === 0 && <h2>¡Tiempo terminado!</h2>}
                            </div>
                        </div>
                        {
                            actualProfesor != undefined &&
                            <img style={{ left: `${xPositionProfesor}%`, top: `${yPositionProfesor}%`}} src={`/${actualProfesor.name}.gif`} className={styles.profesor} alt={`Foto de ${actualProfesor.name}`} />
                        }
                        {
                            actualStudent != undefined &&
                            <img style={{ left: `${xPositionStudent}%`, top: `${yPositionStudent}%`}} src={`/${actualStudent.name}.gif`} className={styles.alumno} alt={`Foto de ${actualStudent.name}`} />
                        }
                        {
                            game === false &&
                            <>
                                <div className={styles.finalGameBody}>
                                    <div className={styles.finalGame}>
                                        <h2 style={{fontSize: "50px" ,marginBottom: "5px"}}>{finalText}</h2>
                                        <h3 style={{marginBottom: "10px"}}>Partida terminada</h3>
                                        <p style={{fontSize: "18px", marginBottom: "5px", fontStyle: "italic"}}>Obtuviste {playerPoints} puntos</p>
                                        <p style={{fontSize: "18px", marginBottom: "5px"}}>Los jugadores con más puntos son:</p>
                                        <ul>
                                            {listPlayers.map((player) => {
                                                return <li>{player.username}: {player.puntos} puntos</li>
                                            })}
                                        </ul>
                                        <div>
                                            <button onClick={startAgain}>Jugar otra vez</button>
                                            <button onClick={closeSession}>Salir</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                        <div className={styles.bottombar}>
                            <h2>Promedio: {actualUser[1]}</h2>
                        </div>
                    </div>
                </>
            }
            <button onClick={logOut}>Log out</button>
        </>
    )
}