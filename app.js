// Obteniendo referencias a los elementos del DOM
const taskInput = document.getElementById('new-task');
const pendingTasks = document.getElementById('pending-tasks');
const inProgressTasks = document.getElementById('in-progress-tasks');
const completedTasks = document.getElementById('completed-tasks');

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', loadTasks);

// Función para agregar una nueva tarea
function addTask() {
    const taskText = taskInput.value;

    if (taskText === '') {
        alert('Por favor, ingresa una tarea.');
        return;
    }

    const task = {
        text: taskText,
        status: 'pending' // Estado inicial: pendiente
    };

    // Agregar la tarea a la interfaz
    createTaskElement(task);

    // Guardar la tarea en LocalStorage
    saveTask(task);

    // Limpiar el campo de entrada
    taskInput.value = '';
}

// Función para crear un elemento de tarea en el DOM
function createTaskElement(task) {
    const li = document.createElement('li');
    li.textContent = task.text;

    // Botón para mover la tarea entre diferentes estados
    const moveBtn = document.createElement('button');
    moveBtn.classList.add('move');
    
    if (task.status === 'pending') {
        moveBtn.textContent = 'Mover a En Curso';
        li.appendChild(moveBtn);
        pendingTasks.appendChild(li);
    } else if (task.status === 'inProgress') {
        moveBtn.textContent = 'Mover a Realizadas';
        li.appendChild(moveBtn);
        inProgressTasks.appendChild(li);
    } else if (task.status === 'completed') {
        li.classList.add('completed');
        completedTasks.appendChild(li);
    }

    // Botón para eliminar tarea
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.classList.add('delete');
    deleteBtn.onclick = function () {
        deleteTask(task.text);
        li.remove();
    };
    li.appendChild(deleteBtn);

    // Lógica para mover la tarea entre las listas
    moveBtn.onclick = function () {
        if (task.status === 'pending') {
            task.status = 'inProgress';
            inProgressTasks.appendChild(li);
            moveBtn.textContent = 'Mover a Realizadas';
        } else if (task.status === 'inProgress') {
            task.status = 'completed';
            completedTasks.appendChild(li);
            li.classList.add('completed');
            moveBtn.remove(); // No permitir mover más si está completada
        }

        updateTaskStatus(task); // Actualizar estado en LocalStorage
    };
}

// Función para guardar una tarea en LocalStorage
function saveTask(task) {
    let tasks = getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Función para obtener tareas de LocalStorage
function getTasksFromStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// Función para cargar tareas al iniciar
function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => {
        createTaskElement(task);
    });
}

// Función para eliminar una tarea de LocalStorage
function deleteTask(taskText) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Función para actualizar el estado de una tarea en LocalStorage
function updateTaskStatus(updatedTask) {
    let tasks = getTasksFromStorage();
    tasks = tasks.map(task => {
        if (task.text === updatedTask.text) {
            return updatedTask;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Seleccionamos el botón de guardar
const saveButton = document.getElementById('save-button');

// Verificamos si todas las tareas están completadas y habilitamos el botón de guardar
function checkAllTasksCompleted() {
    const taskSections = document.querySelectorAll('.task-section ul');
    let allCompleted = true;

    // Verificamos todas las listas de tareas (Por hacer, En curso, Realizadas)
    taskSections.forEach(section => {
        const tasks = section.querySelectorAll('li');
        tasks.forEach(task => {
            if (!task.classList.contains('completed')) {
                allCompleted = false;
            }
        });
    });

    // Si todas las tareas están completadas, habilitamos el botón de guardar
    if (allCompleted) {
        saveButton.disabled = false;
    } else {
        saveButton.disabled = true;
    }
}

// Generar y descargar el archivo
saveButton.addEventListener('click', function() {
    // Obtenemos las tareas completadas
    const completedTasks = document.querySelectorAll('.completed');
    let taskText = 'Tareas Completadas:\n\n';

    completedTasks.forEach(task => {
        taskText += `- ${task.textContent.trim()}\n`;
    });

    // Crear un archivo de texto
    const blob = new Blob([taskText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Crear un enlace temporal para la descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tareas-completadas.txt';

    // Activar la descarga
    document.body.appendChild(link);
    link.click();

    // Limpiar el enlace temporal
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
});

// Llamamos a la función checkAllTasksCompleted después de cada cambio en las tareas
document.querySelectorAll('.task-section').forEach(section => {
    section.addEventListener('click', checkAllTasksCompleted);
});
