import React, { useEffect, useState } from "react";

function ToDoList() {
    const [task, setTask] = useState("");
    const [list, setList] = useState([]);

    const handleChange = (event) => {
        setTask(event.target.value);
    };

    const obtenerTareas = () => {
        fetch('https://playground.4geeks.com/todo/users/victoria_32')
        .then((response) => {
            if (response.status === 404) {
                crearUsuario();
            } else {
                return response.json();
            }
        })
        .then((data) => {
            if (data && data.todos) {
                setList(data.todos);
            }
        })
        .catch((error) => console.log(error));
    };

    const crearUsuario = () => {
        fetch('https://playground.4geeks.com/todo/users/victoria_32', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then((response) => {
            if (response.status === 201) {
                obtenerTareas();
            }
            return response.json();
        })
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
    };

    const agregarTarea = (event) => {
        if (event.key === "Enter" && task.trim() !== "") {
            fetch(`https://playground.4geeks.com/todo/todos/victoria_32`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "label": task.trim(),
                    "is_done": false
             })
            })
            .then((response) => response.json())
            .then((data) => {
                setTask("");
                obtenerTareas();
            })
            .catch((error) => console.log(error));
        }
    };

    const borrarTarea = (id) => {
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then((response) => {
            if (response.ok) {
                obtenerTareas();
            } else {
                return response.json();
            }
        })
        .then((data) => {
            if (data) {
                console.log(data);
            }
        })
        .catch((error) => console.log(error));

    };

    const borrarLista = () => {
        fetch('https://playground.4geeks.com/todo/users/victoria_32', {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([])
        })
        .then((response) => {
            if (response.ok) {
                setList([]);
            } else {
                return response.json();
            }
        })
        .then((data) => {
            if (data) {
                console.log(data);
            }
        })
        .catch((error) => console.log(error));
    };

    useEffect(() => {
        obtenerTareas();}, 
        []);

    return (
        <div style={{ width: "500px" }}>
            <h1 className="display-6">Lista de tareas</h1>
            <ul className="list-group">
                <li className="list-group-item">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nueva tarea"
                        onChange={handleChange}
                        value={task}
                        onKeyDown={agregarTarea}
                    />
                </li>
                
                {list.length === 0 ? (
                    <li className="list-group-item text-center text-danger"> 
                        No hay tareas. Añadir nueva tarea.
                    </li> 
                ) : (
                    list.map((item, index) => (
                        <li key={index} 
                            className="list-group-item d-flex justify-content-between align-items-center">
                            {item.label}
                            
                            <span 
                                onClick={() => borrarTarea(item.id)} 
                                style={{ cursor: 'pointer' }}>
                                <i className="fa fa-times text-danger"></i>
                            </span>
                        </li>
                    ))
                )}
                <li className="text-danger text-center m-3"> <button onClick={borrarLista} className="btn btn-light border">Borrar lista</button> </li>
                <li className="text-secondary text-center">Hay {list.length} tareas</li>
            </ul>
        </div>
);}

export default ToDoList;