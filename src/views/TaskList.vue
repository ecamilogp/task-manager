<script setup lang="ts">
import type { Task } from '@/interfaces/taskForm';
import { ref, onMounted } from 'vue';
import { useTaskStore } from '@/stores/userTaskStore';

const taskStore = useTaskStore();

const taskForm = ref<Task>({
  title: '',
  assignee: '',
  description: '',
  id: 0,
  status: '',
});

const statusOption = ['To Do', 'In Progress', 'Done'];

function addTask() {
  if (taskForm) {
    taskStore.addTask({ ...taskForm.value });
  }
}

function editTask() {
  taskStore.updateTask({ ...taskForm.value });
}

function deleteTask(id: number) {
  taskStore.deleteTask(id);
}

onMounted(async () => {
  await taskStore.fetchTasks();
});
</script>

<template>
  <div class="task-manager">
    <nav class="task-manager__nav">
      <div class="task-manager__menu">
        <q-icon name="menu" class="task-manager__menu-icon" />
        <strong class="task-manager__title">TaskManagerProject</strong>
      </div>
      <router-link to="/">
        <button class="task-manager__logout">Logout</button>
      </router-link>
    </nav>

    <!-- Formulario para agregar tareas -->
    <div class="task-form">
      <strong class="task-form__title">Add New Task</strong>

      <div class="task-form__group">
        <q-input
          v-model="taskForm.title"
          class="task-form__input"
          label="Task Title"
          filled
          dense
          color="dark"
        />
        <q-input
          v-model="taskForm.assignee"
          class="task-form__input"
          label="Assignee"
          filled
          dense
          color="dark"
        />
      </div>

      <div class="task-form__group">
        <q-input
          v-model="taskForm.description"
          class="task-form__input"
          label="Task Description"
          filled
          color="dark"
        />
      </div>

      <div class="task-form__group">
        <q-select
          v-model="taskForm.status"
          :options="statusOption"
          label="status"
          class="task-form__input"
          filled
          dense
          color="dark"
        />
      </div>

      <button class="task-form__button" @click="addTask()">Add Task</button>

      <!-- Loader mientras carga -->
      <div v-if="taskStore.loading" class="task-list__loader">
        <q-spinner color="gray" size="40px" />
      </div>

      <!-- Contenedor de tareas con 3 columnas -->
      <div v-else class="task-list__container">
        <!-- Sección To Do -->
        <div class="task-list__column">
          <h3 class="task-list__column-title">To Do</h3>
          <div class="task-list__cards">
            <div
              v-for="task in taskStore.tasks.filter(
                (t) => t.status === 'To Do'
              )"
              :key="task.id"
              class="card to-do"
            >
              <div class="card-header">
                <q-icon name="info" class="task-icon" />
              </div>
              <strong class="title-card">{{ task.title }}</strong>
              <p>Asignado a {{ task.assignee }}</p>
              <div class="card-footer">
                <q-icon name="menu" class="task-icon__delete" />
                <q-icon
                  name="delete"
                  class="task-icon__delete"
                  @click="deleteTask(task.id)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Sección In Progress -->
        <div class="task-list__column">
          <h3 class="task-list__column-title">In Progress</h3>
          <div class="task-list__cards">
            <div
              v-for="task in taskStore.tasks.filter(
                (t) => t.status === 'In Progress'
              )"
              :key="task.id"
              class="card in-progress"
            >
              <div class="card-header">
                <q-icon name="info" class="task-icon" />
              </div>
              <strong class="title-card">{{ task.title }}</strong>
              <p>Asignado a {{ task.assignee }}</p>
              <strong> </strong>
              <div class="card-footer">
                <q-icon name="menu" class="task-icon__delete" />
                <q-icon
                  name="delete"
                  class="task-icon__delete"
                  @click="deleteTask(task.id)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Sección Done -->
        <div class="task-list__column">
          <h3 class="task-list__column-title">Done</h3>
          <div class="task-list__cards">
            <div
              v-for="task in taskStore.tasks.filter((t) => t.status === 'Done')"
              :key="task.id"
              class="card done"
            >
              <div class="card-header">
                <q-icon name="info" class="task-icon" />
              </div>
              <strong class="title-card">{{ task.title }}</strong>
              <p>Asignado a {{ task.assignee }}</p>
              <div class="card-footer">
                <q-icon name="menu" class="task-icon__delete" />
                <q-icon
                  name="delete"
                  class="task-icon__delete"
                  @click="deleteTask(task.id)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
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
  overflow: auto;
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

/* loader  */
.task-list__loader {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

/* Lista de tareas */

/* Contenedor principal de las columnas */
.task-list__container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
}

.task-list__column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 70%;
  border-radius: 8px;
  padding: 10px;
}

.task-list__column-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.task-list__cards {
  width: 100%;
  height: 425px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  overflow-y: auto;
  max-height: 80%;
  padding-right: 10px;
  overflow-y: auto;
}

/* Estilos para las tarjetas */
.title-card {
  font-size: 18px;
  font-weight: 500;
}

.card {
  width: 90%;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: start;
}
.card:hover {
  transform: scale(1.05);
}

/* Colores según el estado */
.card.to-do {
  background-color: #fdd9d9;
  border-color: #f8b5b5;
}

.card.in-progress {
  background-color: #ffffd1;
  border-color: #f6e2a7;
}

.card.done {
  background-color: #e4ffd7;
  border-color: #b0ecbe;
}
/* iconos */
.card-header {
  display: flex;
  justify-content: end;
}

.card-footer {
  display: flex;
  justify-content: space-between;
}
.task-icon {
  font-size: 24px;
}

.task-icon__delete {
  font-size: 24px;
}
</style>
