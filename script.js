const btnAdd = document.getElementById("btnAddTask");
const inputTask = document.getElementById("addTask");
const list = document.getElementById("taskList")

const saveTasksToLocalStarge = () => {
    const tasks = [];
    const taskItems = list.querySelectorAll("li");
    taskItems.forEach((item) => {
        const textTask = item.firstChild.textContent.trim();
        tasks.push(textTask);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const createElementTask = (text) => {
    const newTask = document.createElement("li");
    newTask.textContent = text;

    const deleteBtn = document.createElement ("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.addEventListener("click", () => {
        newTask.classList.add("fade-out");
        setTimeout(() => {
            newTask.remove();
            saveTasksToLocalStarge();
        }, 300);
    });
    newTask.appendChild(deleteBtn);
    list.appendChild(newTask);
}

const loadTask = () => {
    const taskSaved = localStorage.getItem("tasks");
    if (taskSaved) {
        const tasks = JSON.parse(taskSaved);
        tasks.forEach((task) => {
            createElementTask(task);
        });
    }
};
    
    const addTask = () => {
    const inputTaskvalue = inputTask.value.trim();
     
    if (inputTaskvalue === "") {
        alert("Escribe una tarea!");
        return;
    }

    createElementTask(inputTaskvalue);
    saveTasksToLocalStarge();
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
                saveTasksToLocalStarge();
            }, 300);
        }
    }
});
