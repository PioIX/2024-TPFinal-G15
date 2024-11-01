"use client"
import Message from "@/components/Message";
import Button_theme from "@/components/Button_theme";
import InputLogin from "@/components/InputLogin";
import InputNC from "@/components/InputNC";
import Profesor from "@/components/Profesor";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import styles from "./page.module.css";
import Mapa from "@/components/Mapa";

export default function home() {
    const [theme, setTheme] = useState("light");
    const [contactName, setContactName] = useState("Nombre Usuario");
    const [actualChat, setActualChat] = useState(null);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [actualUser, setActualUser] = useState([]);
    const [selectProfesor, setSelectProfesor] = useState(false);


    let user = ""

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
        setActualUser([])
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    
    const [seconds, setSeconds] = useState(180); // 3 minutos en segundos
    const [contador, setContador] = useState(false)
    const [profesores, setProfesores] = useState([{ name: "Marche", description: "Bondadoso" }, { name: "Facón", description: "Experto en desaprobar alumnos" }, { name: "Rivi", description: "Paciente" }, { name: "Brenda", description: "Experta en Ubuntu" }, { name: "Santi", description: "Pecho frio" }, { name: "Feli", description: "The BOSS" }, { name: "Belu", description: "Chusma" }, { name: "Damatto", description: "Ecologista" }, { name: "Ana", description: "Ama poner partes" }, { name: "Caro Bruno", description: "Gallina" }, { name: "Pablito", description: "Se hace el gorra" }, { name: "Chela", description: "Jardinera" }])
    const [alumnos, setAlumnos] = useState([{ name: "Maraval", description: "Pelado insoportable." }, { name: "Lujan", description: "Experta en quejas" }, { name: "Tomi", description: "Pollera" }, { name: "Cachete", description: "Traga" }, { name: "Mica", description: "Gimnasta" }, { name: "May", description: "Gei" }, { name: "Candela", description: "Ex comu" }, { name: "Lucas", description: "Judio" }, { name: "Juan", description: "Golpeado" }, { name: "Agus", description: "El primo" }, { name: "Tomi Beli", description: "Anti Pala" }])
    const [mapas, setMapas] =useState (["sale1", "sale2", "sale3"])
    const [profesorSeleccionado, setProfesorSeleccionado] = useState(0)
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(0)
    const [mapaSeleccionado, setMapaSeleccionado] = useState (0)
    const [actualProfesor, setActualProfesor] = useState()
    const [actualStudent, setActualStudent] = useState()
    const [selectPlayer, setSelectPlayer] = useState(false)
    const [selectStudent, setSelectStudent] = useState(false)
    const [userPlayer, setUserPlayer] = useState("")
    const [selectMap, setSelectMap]= useState (false)

    const [xPositionProfesor, setXProfesor] = useState(10);
    const [xPositionStudent, setXStudent] = useState(10);
    const [yPositionProfesor, setYProfesor] = useState(5);
    const [yPositionStudent, setYStudent] = useState(5);
    const [listo, setListo] = useState(false)
    const [listoProfesor, setListoProfesor] = useState(false);
    const [listoAlumno, setListoAlumno] = useState(false);
    function handleContador() {
        setContador(true)
    }

    const handleKeyDown = (event) => {
        console.log(event.key); // Para depurar
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

    const altoPantalla = window.innerHeight
    const anchoPantalla = window.outerWidth

    const [keyState, setKeyState] = useState({});

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
        //console.log("ENTRE AL EVENTO", event.key); // Para depurar
        if (keyState['W'] || keyState['w']) {
            if (player == "profesor") {
                if (yPositionProfesor - 5 > 0) {
                    setYProfesor(yPositionProfesor - 5)
                }
            } else if (player == "student") {
                if (yPositionStudent + 5 < altoPantalla - 90) {
                    setYStudent(yPositionStudent + 5)
                }
            }
        }
        if (keyState['A'] || keyState['a']){
            if (player == "profesor") {
                if (xPositionProfesor - 5 > 0) {
                    setXProfesor(xPositionProfesor - 5)
                }
            } else if (player == "student") {
                if (xPositionStudent + 5 < anchoPantalla - 90) {
                    setXStudent(xPositionStudent + 5)
                }
            }
        }
        if (keyState['S'] || keyState['s']) {
            if (player == "profesor") {
                if (yPositionProfesor + 5 < altoPantalla - 90) {
                    setYProfesor(yPositionProfesor + 5)
                }
            } else if (player == "student") {
                if (yPositionStudent - 5 > 0) {
                    setYStudent(yPositionStudent - 5)
                }
            }
        }
        if (keyState['D'] || keyState['d']) {
            if (player == "profesor") {
                if (xPositionProfesor + 5 < anchoPantalla - 90) {
                    setXProfesor(xPositionProfesor + 5)
                }
            } else if (player == "student") {
                if (xPositionStudent - 5 > 0) {
                    setXStudent(xPositionStudent - 5)
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
        handleMovement(userPlayer);

        console.log(keyState)
    }, [keyState, userPlayer]);

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
            console.log(mapaSeleccionado)
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
        setSelectProfesor(false)
        setProfesorSeleccionado(0)
        setSelectMap(true)
    }

    function changeSelectStudent() {
        setActualStudent(alumnos[alumnoSeleccionado])
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
        const result = response.json();

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
            setListoProfesor(true)
            socket.emit("pingListo", {
                userId: actualUser[0],
                listoProfesor: true
            })
        }
        if (userPlayer === "student"){
            setListoAlumno(true)
            socket.emit("pingListo", {
                userId: actualUser[0],
                listoAlumno: true
            })
        }
    }

    //MARK: Contador
    useEffect(() => {
        if (seconds > 0 && contador === true && listoAlumno === true && listoProfesor === true) {
            const timer = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);

            return () => clearInterval(timer); // Limpiar el intervalo al desmontar
        }
    }, [seconds, contador]);

    const formatTime = (sec) => {
        const minutes = Math.floor(sec / 60);
        const remainingSeconds = sec % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };
    
    useEffect(() => {
        if (socket && userPlayer === "profesor" && actualProfesor != undefined){
            console.log("ENTRE EN LA FUNCION PINGALL PROFESOR")
            socket.emit("pingAll",{
                xPositionProfesor: xPositionProfesor,
                yPositionProfesor: yPositionProfesor,
                actualProfesor: actualProfesor,
                userId: actualUser[0]}
                //Se lo mando como objeto
            );
        }
    }, [xPositionProfesor, yPositionProfesor, userPlayer, actualProfesor]);

    useEffect(() => {
        if (socket && userPlayer === "student" && actualStudent != undefined){
            console.log("ENTRE EN LA FUNCION PINGALL ALUMNO")
            socket.emit("pingAll",{
                xPositionStudent: xPositionStudent,
                yPositionStudent: yPositionStudent,
                actualStudent: actualStudent,
                userId: actualUser[0]}
            //Se lo mando como objeto
        );
        }
    }, [xPositionStudent, yPositionStudent, userPlayer, actualStudent, actualUser]);

    useEffect(() => {
        console.log(listoAlumno, listoProfesor)
        if (socket && listoAlumno === true && listoProfesor === true){
            setListo(false)
            socket.emit("pingListo", {
                inicioPartida: true
            })
        }
    }, [listoProfesor, listoAlumno]);

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
                            <h3>User</h3>
                            <InputLogin type={"text"} placeholder={"Ingrese su usuario"} onChange={handleUsernameChange} value={username} />
                            <h3>Password</h3>
                            <InputLogin type={"password"} placeholder={"Ingrese su contraseña"} onChange={handlePasswordChange} value={password} />
                            <div>
                                <button onClick={login}>Login</button>
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
                </>
            }
            {
                selectStudent === true &&
                <>
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
                </>
            }
            {
                selectMap === true &&
                <>
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
                            <p className={styles.pheader}>{contactName}</p>
                            <Button_theme />
                            <div>
                                <h1>Contador: {formatTime(seconds)}</h1>
                                {seconds === 0 && <h2>¡Tiempo terminado!</h2>}
                            </div>
                        </div>
                        {
                            actualProfesor != undefined &&
                            <img style={{ left: `${xPositionProfesor}px`, top: `${yPositionProfesor}px`, background: "#F00000"}} src={`/${actualProfesor.name}.gif`} className={styles.profesor} alt={`Foto de ${actualProfesor.name}`} />
                        }
                        {
                            actualStudent != undefined &&
                            <img style={{right: `${xPositionStudent}px`, bottom: `${yPositionStudent}px`, background: "#F00000"}} src={`/${actualStudent.name}.gif`} className={styles.alumno} alt={`Foto de ${actualStudent.name}`} />
                        }
                        <div className={styles.chat} id="chat">
                            {/* {chats.map(chat => (
                                chat.messages.length > 0 && chat.chatId === actualChat ? (
                                    chat.messages.map((msg) => {
                                        if (msg.userId === actualUser[0]) {
                                            user = "user"
                                        } else {
                                            user = "other"
                                        }
                                        return <Message variant={user} theme={theme} message={msg.message} name={msg.username}/>
                                    })
                                ) : (
                                    <></>
                                )
                            ))} */}
                        </div>
                        <div className={styles.bottombar}>
                            <h2>Promedio: {actualUser[1]}</h2>
                        </div>
                    </div>
                </>
            }
        </>
    )
}