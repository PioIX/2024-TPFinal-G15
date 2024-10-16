"use client"
import Message from "@/components/Message";
import Button_theme from "@/components/Button_theme";
import InputLogin from "@/components/InputLogin";
import InputNC from "@/components/InputNC";
import Profesor from "@/components/Profesor";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import styles from "./page.module.css";

export default function home(){
    const [theme, setTheme] = useState("light");
    const [contactName, setContactName] = useState("Nombre Usuario");
    const [actualChat, setActualChat] = useState(null);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [actualUser, setActualUser] = useState([]);
    const [newChatUser, setNewChatUser] = useState("");
    const [newChatName, setNewChatName] = useState("");
    const [selectProfesor, setSelectProfesor] = useState(false);


    let user = ""

    const [chats, setChats] = useState([]);

    async function register () {
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
    
            if (result === undefined || result.length === 0){
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
                
                
                if (result1 != undefined || result1.length != 0){
                    setActualUser([result1.user[0].userId, result1.user[0].username])
                    alert("Registro realizado correctamente")
                    setUsername("")
                    setPassword("")
                    handleContador()
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

            if (result.user){
                setActualUser([result.user[0].userId, result.user[0].username])
                alert("Inicio de sesión correcto")
                setUsername("")
                setPassword("")
                handleContador()
                setSelectProfesor(true)
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
    
    function selectChat(chat) {
        socket.emit("leaveRoom", {room:actualChat})
        setContactName(chat.name);
        setActualChat(chat.chatId)
        // getMessages(chat)
        // getChatList()
        console.log(chats)
        socket.emit("joinRoom", {room:chat.chatId})
    }
    
    useEffect(() => {
        // getChatList();
    }, [actualUser]);
    
    const [newMessage, setNewMessage] = useState()
    
    const sendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                chatId: actualChat,
                message: message.trim(),
                userId: actualUser[0],
                username: actualUser[1]
            };

            setChats(prevChats => 
                prevChats.map(chat => 
                    chat.chatId === actualChat 
                        ? { ...chat, messages: [...chat.messages, newMessage] }
                        : chat
                )
            );

            socket.emit("sendMessage", {message: newMessage})

            setMessage("");
        }
    };

    useEffect(() => {
        if (actualUser[0] != undefined) {
            if (newMessage.message.message.userId != actualUser[0]){
                console.log(newMessage)
                console.log(actualUser[0])
    
                setChats(prevChats => 
                    prevChats.map(chat => 
                        chat.chatId === actualChat 
                            ? { ...chat, messages: [...chat.messages, newMessage.message.message] }
                            : chat
                    )
                );
            }
        }
    },[newMessage])

    async function insertMessages(){
        if (message != "" && message != undefined) {
            const data = {
                chatId: actualChat,
                message: message.trim(),
                userId: actualUser[0]
            }
    
            const response = await fetch('http://127.0.0.1:4000/insertMessage', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) throw new Error('Error al enviar el mensaje');
    
            const result = await response.json();
    
            console.log(result)
    
            sendMessage()
        } else {
            alert("No se puede enviar un mensaje vacío")
        }
    }

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    function modoOscuro() {
        var element = document.body;
        element.classList.toggle(styles.dark_mode);
        if (theme == "light"){
            setTheme("dark")
        } else {
            setTheme("light")
        }
    }

    async function addChat() {
        if (newChatUser != "" && newChatName != "" && newChatName != actualUser[1]) {
            const data = {
                username: newChatUser,
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
            console.log(result)
            console.log(result[0].userId)
            
            if (result != undefined || result.length != 0){
                const data3 = {
                    name: newChatName,
                    userId: actualUser[0]
                }
        
                const response3 = await fetch('http://127.0.0.1:4000/insertChat', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data3),
                });
        
                if (!response3.ok) throw new Error('Error al enviar el mensaje');
                const result3 = await response3.json();
        
                if (result3) {
                    console.log(result3)
                    const data2 = {
                        chatId: result3.result[0].chatId,
                        userId1: actualUser[0],
                        userId2: result[0].userId
                    }
            
                    const response2 = await fetch('http://127.0.0.1:4000/insertChats_users', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data2),
                    });
            
                    if (!response2.ok) throw new Error('Error al enviar el mensaje');
                    const result2 = await response2.json();
                    console.log(newChatUser)
                    socket.emit("newRoom", {username: newChatUser})
                }
            }
            // getChatList()
        } else {
            alert("Completar la información")
        }
    }

    //MARK: Socket
    const { socket, isConnected } = useSocket();
    
    useEffect(() => {
        if(!socket) return;
        
        socket.on("pingAll", (data) => {
            console.log("Me llego el evento pingAll", data)
        });
        
        socket.on("newRoom", (data) => {
            setNewRoomUser(data)
            if (data.user === actualUser[1]){
                console.log("New Room Created", data)
                console.log("New Room Created, User: ", data)
            }
        });
        
        socket.on("newMessage", (data) => {
            if (data.message.message.userId != actualUser[0]){
                console.log("Mensaje de la sala: ", data)
                setNewMessage(data)
            }
        })

        return() => {
            socket.off("message")
        }
    }, [socket, isConnected]);

    const [seconds, setSeconds] = useState(180); // 3 minutos en segundos
    const [contador, setContador] = useState(false)
    const [profesores, setProfesores] = useState([{name: "Marche", description: "Bondadoso"}, {name: "Facón", description: "Experto en desaprobar alumnos"}, {name: "Rivi", description: "Paciente"}, {name: "Brenda", description: "Experta en Ubuntu"}, {name: "Santi", description: "Pecho frio"}, {name: "Feli", description: "The BOSS"}, {name: "Rossi", description: "Mucho muy rápido"}])
    const [profesorSeleccionado, setProfesorSeleccionado] = useState(0)

    function handleContador(){
        setContador(true)
    }

    // Solucionar tema de apretar flechas y que se cambien los profesores
    // addEventListener("rightarrow", (event) => {handleRight});
    const handleKeyDown = (event) => {
        // Cambia 'Enter' por la tecla que desees (puedes usar el código de la tecla o el nombre)
        if (event.key === 'Enter') {
          handleRight();
        }
      };
    
      useEffect(() => {
        // Añadir el evento al montar el componente
        window.addEventListener('keydown', handleKeyDown);
    
        // Limpiar el evento al desmontar
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, []);
    
    function handleRight(){
        if (profesores.length - 1 != profesorSeleccionado) {
            setProfesorSeleccionado(profesorSeleccionado + 1)
        } else {
            setProfesorSeleccionado(0)
        }
    }

    function handleLeft(){
        if (profesorSeleccionado > 0) {
            setProfesorSeleccionado(profesorSeleccionado - 1)
        } else {
            setProfesorSeleccionado(profesores.length - 1)
        }
    }
      
    useEffect(() => {
        if (seconds > 0 && contador === true) {
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

    return(
        <>
            {
                actualUser == "" &&
                <>
                    <div className={styles.bodyLogin}>
                        <div className={styles.login}>
                            <h2>Login</h2>
                            <h3>User</h3>
                            <InputLogin type={"text"} placeholder={"Ingrese su usuario"} onChange={handleUsernameChange} value={username}/>
                            <h3>Password</h3>
                            <InputLogin type={"password"} placeholder={"Ingrese su contraseña"} onChange={handlePasswordChange} value={password}/>
                            <div>
                                <button onClick={login}>Login</button>
                                <button onClick={register}>Registrarse</button>
                            </div>
                        </div>
                    </div>
                </>
            }
            {
                selectProfesor === true &&
                <>
                    <div className={styles.bodySelectProfesor}>
                        <button onClick={handleLeft}><img src="/../../atras.png" height={"80px"}/></button>
                        <div className={styles.selectProfesor}>
                            <Profesor name={profesores[profesorSeleccionado].name} description={profesores[profesorSeleccionado].description}/>
                            <div className={styles.selectProfesorDiv}>
                            </div>
                        </div>
                        <button onClick={handleRight}><img src="/../../adelante.png" height={"80px"}/></button>
                    </div>
                </>
            }
            {
                actualUser != "" && selectProfesor == false &&
                <>
                    <div className={styles.body}>
                        <div className={styles.topbar}>
                            <p className={styles.pheader}>{contactName}</p>
                            <Button_theme onClick={modoOscuro}/>
                            <div>
                                <h1>Contador: {formatTime(seconds)}</h1>
                                {seconds === 0 && <h2>¡Tiempo terminado!</h2>}
                            </div>
                        </div>
                        <div className={styles.chat} id="chat">
                            {chats.map(chat => (
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
                            ))}
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