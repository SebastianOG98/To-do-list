const API_URL = "http://localhost:3000/tasks";

export const fetchService = {
  // Obtener todas las tareas
  async getTasks() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener las tareas");
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  },

  // Crear una nueva tarea
  async createTask(taskData) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("Error al crear la tarea");
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  },

  // Actualizar el estado de una tarea (completada / pendiente)
  async updateTask(id, updateData) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error("Error al actualizar la tarea");
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  },

  // Eliminar una tarea por ID
  async deleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar la tarea");
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }
};