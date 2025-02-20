<script setup lang="ts">
import { ref } from 'vue';

const taskTitle = ref('');
const assignee = ref('');
const taskDescription = ref('');
const dueDate = ref('');
</script>

<template>
  <div class="task-manager">
    <nav class="task-manager__nav">
      <div class="task-manager__menu">
        <q-icon name="menu" class="task-manager__menu-icon" />
        <strong class="task-manager__title">TaskManagerProject</strong>
      </div>
      <button class="task-manager__logout">Logout</button>
    </nav>

    <div class="task-form">
      <strong class="task-form__title">Add New Task</strong>

      <div class="task-form__group">
        <q-input
          v-model="taskTitle"
          class="task-form__input"
          label="Task Title"
          filled
          dense
        />
        <q-input
          v-model="assignee"
          class="task-form__input"
          label="Assignee"
          filled
          dense
        />
      </div>

      <div class="task-form__group">
        <q-input
          v-model="taskDescription"
          class="task-form__input"
          label="Task Description"
          filled
        />
      </div>

      <div class="task-form__group">
        <q-input
          v-model="dueDate"
          class="task-form__input"
          label="Due Date"
          filled
          dense
          type="date"
        />
      </div>

      <button class="task-form__button">Add Task</button>
    </div>
  </div>
</template>

<style scoped>
/* Estilos generales */
.task-manager {
  height: 100vh;
  width: 100vw;
  background-color: rgb(233, 233, 233);
  box-sizing: border-box;
  overflow: hidden;
}

/* Navbar */
.task-manager__nav {
  width: 98%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 10px;
  margin: 20px auto 15px auto;
}

/* Contenedor del icono y título */
.task-manager__menu {
  display: flex;
  align-items: center;
  gap: 10px;
}

.task-manager__menu-icon {
  font-size: 24px;
  cursor: pointer;
  transition: 0.3s;
}

.task-manager__menu-icon:hover {
  color: gray;
}

.task-manager__title {
  font-size: 20px;
}

.task-manager__logout {
  background-color: rgba(230, 230, 230, 0.959);
  border: 1px solid #ddd;
  padding: 5px 10px;
  cursor: pointer;
  transition: 0.5s;
}

.task-manager__logout:hover {
  background-color: #f0f0f0;
}

/* Formulario de tareas */
.task-form {
  background-color: white;
  width: 98%;
  margin: 20px auto 15px auto;
  padding: 20px;
}

.task-form__title {
  font-size: 25px;
}

.task-form__group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.task-form__input {
  width: 100%;
  font-size: 14px;
}

/* Botón de agregar tarea */
.task-form__button {
  width: 100%;
  background-color: black;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s;
}

.task-form__button:hover {
  background-color: rgb(50, 50, 50);
}
</style>
