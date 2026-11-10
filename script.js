import { fetchService } from "./fetchService.js";

const btnAdd = document.getElementById("btnAddTask");
const inputTask = document.getElementById("addTask");
const list = document.getElementById("taskList");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

const updateCounters = () => {
    const taskItems = list.querySelectorAll("li");
    const total = taskItems.length;
    const completed = list.querySelectorAll("li.completed").length;
    const pending = total - completed;

    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
};

const createElementTask = (taskObj) => {
    const { id, text, completed } = taskObj;
    
    const newTask = document.createElement("li");
    newTask.textContent = text;
    newTask.dataset.id = id; // Guardamos el ID de la base de datos en el elemento DOM

    if (completed) {
        newTask.classList.add("completed");
    }

    // Evento para alternar estado completado
    newTask.addEventListener("click", async (e) => {
        if (e.target.tagName !== "BUTTON") {
            const isNowCompleted = !newTask.classList.contains("completed");
            
            // Actualizamos en la base de datos
            await fetchService.updateTask(id, { completed: isNowCompleted });
            
            newTask.classList.toggle("completed");
            updateCounters();
        }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.addEventListener("click", async () => {
        // Eliminamos de la base de datos
        const success = await fetchService.deleteTask(id);
        if (success) {
            newTask.classList.add("fade-out");
            setTimeout(() => {
                newTask.remove();
                updateCounters();
            }, 300);
        }
    });

    newTask.appendChild(deleteBtn);
    list.appendChild(newTask);
    updateCounters();
};

const loadTasks = async () => {
    list.innerHTML = ""; // Limpiamos la lista visual antes de cargar
    const tasks = await fetchService.getTasks();
    tasks.forEach((taskObj) => {
        createElementTask(taskObj);
    });
    updateCounters();
};

const addTask = async () => {
    const inputTaskValue = inputTask.value.trim();
    
    if (inputTaskValue === "") {
        alert("¡Por favor, escribe una tarea antes de añadirla!");
        return;
    }

    const newTaskData = {
        text: inputTaskValue,
        completed: false
    };

    // Guardar en la base de datos y obtener el objeto creado con su ID
    const savedTask = await fetchService.createTask(newTaskData);
    
    if (savedTask) {
        createElementTask(savedTask);
        inputTask.value = "";
    }
};

// Cargar tareas al iniciar la aplicación
loadTasks();

btnAdd.addEventListener("click", addTask);

inputTask.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        addTask();
    }

    if (event.key === "Delete" && inputTask.value === "") {
        const lastTask = list.lastElementChild;
        if (lastTask) {
            const id = lastTask.dataset.id;
            const success = await fetchService.deleteTask(id);
            if (success) {
                lastTask.classList.add("fade-out");
                setTimeout(() => {
                    lastTask.remove();
                    updateCounters();
                }, 300);
            }
        }
    }
});