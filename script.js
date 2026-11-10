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

const saveTasksToLocalStorage = () => {
    const tasks = [];
    const taskItems = list.querySelectorAll("li");
    taskItems.forEach((item) => {
        // Obtenemos únicamente el nodo de texto de la tarea (ignorando el botón)
        const textNode = Array.from(item.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        const textTask = textNode ? textNode.textContent.trim() : "";
        const isCompleted = item.classList.contains("completed");
        tasks.push({ text: textTask, completed: isCompleted });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateCounters();
};

const createElementTask = (text, isCompleted = false) => {
    const newTask = document.createElement("li");
    newTask.textContent = text;

    if (isCompleted) {
        newTask.classList.add("completed");
    }

    newTask.addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON") {
            newTask.classList.toggle("completed");
            saveTasksToLocalStorage();
        }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.addEventListener("click", () => {
        newTask.classList.add("fade-out");
        setTimeout(() => {
            newTask.remove();
            saveTasksToLocalStorage();
        }, 300);
    });

    newTask.appendChild(deleteBtn);
    list.appendChild(newTask);
    updateCounters();
};

const loadTask = () => {
    const taskSaved = localStorage.getItem("tasks");
    if (taskSaved) {
        const tasks = JSON.parse(taskSaved);
        tasks.forEach((taskObj) => {
            const text = typeof taskObj === "string" ? taskObj : taskObj.text;
            const completed = typeof taskObj === "object" ? taskObj.completed : false;
            createElementTask(text, completed);
        });
    }
    updateCounters();
};

const addTask = () => {
    const inputTaskValue = inputTask.value.trim();
    
    if (inputTaskValue === "") {
        alert("¡Por favor, escribe una tarea antes de añadirla!");
        return;
    }

    createElementTask(inputTaskValue, false);
    saveTasksToLocalStorage();
    inputTask.value = "";
};

loadTask();

btnAdd.addEventListener("click", addTask);

inputTask.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }

    if (event.key === "Delete" && inputTask.value === "") {
        const lastTask = list.lastElementChild;
        if (lastTask) {
            lastTask.classList.add("fade-out");
            setTimeout(() => {
                lastTask.remove();
                saveTasksToLocalStorage();
            }, 300);
        }
    }
});
