<script setup lang="ts">
import { computed, onBeforeMount, ref, watchEffect } from 'vue';
import { useTaskStore } from '@/stores/userTaskStore';
import { helpers, maxLength, minLength, required } from '@vuelidate/validators';
import showNotify from '@/utils/showNotify';
import useVuelidate from '@vuelidate/core';
import DeleteModal from './DeleteModal.vue';

const taskStore = useTaskStore();
const draggingTask = ref<number | null>(null);
const statusOption = ['To Do', 'In Progress', 'Done'];
const loading = ref(false);
const deleteModal = ref(false);
const taskToDelete = ref<number | null>(null);

// reglas de validacion
const taskForm = computed(() => taskStore.currentTask);

const rules = computed(() => ({
  title: [
    helpers.withMessage('Este campo es requerido', required),
    helpers.withMessage('Mínimo 5 caracteres', minLength(5)),
    helpers.withMessage('Máximo se permiten 20 caracteres', maxLength(20)),
  ],
  assignee: [
    helpers.withMessage('Este campo es requerido', required),
    helpers.withMessage('Mínimo 5 caracteres', minLength(5)),
    helpers.withMessage('Máximo se permiten 20 caracteres', maxLength(20)),
  ],
  description: [
    helpers.withMessage('Este campo es requerido', required),
    helpers.withMessage('Mínimo 5 caracteres', minLength(5)),
    helpers.withMessage('Máximo se permiten 50 caracteres', maxLength(50)),
  ],
  status: [helpers.withMessage('Este campo es requerido', required)],
}));

const v$ = useVuelidate(rules, taskForm);

// funciones crud
async function addTask() {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    console.log('Error al enviar el formulario');
    return;
  }

  loading.value = true;

  try {
    if (taskForm.value) {
      await taskStore.addTask({ ...taskForm.value });
      showNotify('positive', 'tarea asignada correctamente');
      resetForm();
      v$.value.$reset();
    }
  } catch (error) {
    console.error('Error al asignar la  tarea:', error);
  } finally {
    loading.value = false;
  }
}

async function deleteTask(id: number) {
  await taskStore.deleteTask(id);
  showNotify('positive', 'Tarea eliminada correctamente');
}

function openDeleteModal(id: number) {
  taskToDelete.value = id;
  deleteModal.value = true;
}

function confirmDelete() {
  if (taskToDelete.value !== null) {
    deleteTask(taskToDelete.value);
    closeDeleteModal();
  }
}

function resetForm() {
  taskStore.resetCurrentForm();
  v$.value.$reset();
}

function closeDeleteModal() {
  deleteModal.value = false;
}

// funciones de draggable
function onDragStart(event: DragEvent, taskId: number) {
  draggingTask.value = taskId;
  event.dataTransfer?.setData('text/plain', taskId.toString());
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
}

function onDrop(event: DragEvent, newStatus: string) {
  event.preventDefault();
  const taskId = draggingTask.value;
  if (taskId !== null) {
    const task = taskStore.tasks.find((t) => t.id === taskId);
    if (task) {
      taskStore.updateTask({ ...task, status: newStatus });
    }
  }
  draggingTask.value = null;
}

onBeforeMount(async () => {
  taskStore.recoverTask();
  if (taskStore.tasks.length === 0) {
    taskStore.fetchTasks();
  }
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
          :error="v$.title.$dirty && v$.title.$invalid"
          :error-message="v$.title.$errors[0]?.$message"
        />
        <q-input
          v-model="taskForm.assignee"
          class="task-form__input"
          label="Assignee"
          filled
          dense
          color="dark"
          :error="v$.assignee.$dirty && v$.assignee.$invalid"
          :error-message="v$.assignee.$errors[0]?.$message"
        />
      </div>

      <div class="task-form__group">
        <q-input
          v-model="taskForm.description"
          class="task-form__input"
          label="Task Description"
          filled
          color="dark"
          :error="v$.description.$dirty && v$.description.$invalid"
          :error-message="v$.description.$errors[0]?.$message"
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
          :error="v$.status.$dirty && v$.status.$invalid"
          :error-message="v$.status.$errors[0]?.$message"
        />
      </div>

      <button
        v-if="!loading"
        class="task-form__button"
        :disabled="loading"
        @click="addTask()"
      >
        Add Task
      </button>

      <!-- Loader mientras carga -->
      <div v-if="taskStore.loading" class="task-list__loader">
        <q-spinner color="gray" size="40px" />
      </div>

      <!-- Contenedor de tareas con 3 columnas -->
      <div v-else class="task-list__container">
        <div
          v-for="status in ['To Do', 'In Progress', 'Done']"
          :key="status"
          class="task-list__column"
          @dragover="onDragOver"
          @drop="(event) => onDrop(event, status)"
        >
          <h3 class="task-list__column-title">{{ status }}</h3>
          <div class="task-list__cards">
            <div
              v-for="task in taskStore.tasks.filter((t) => t.status === status)"
              :key="task.id"
              class="card"
              :class="status.toLowerCase().replace(' ', '-')"
              :draggable="true"
              @dragstart="(event) => onDragStart(event, task.id)"
            >
              <div class="card-header">
                <div class="tooltip-container">
                  <q-icon name="info" class="task-icon" />
                  <div class="tooltip">{{ task.description }}</div>
                </div>
              </div>
              <strong class="title-card">{{ task.title }}</strong>
              <p>asignado a {{ task.assignee }}</p>
              <div class="card-footer">
                <q-icon name="menu" class="task-icon__menu" />
                <q-icon
                  name="delete"
                  class="task-icon__delete"
                  @click="openDeleteModal(task.id)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <DeleteModal
    v-if="deleteModal"
    @confirm="confirmDelete"
    @cancel="closeDeleteModal"
  />
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
  cursor: pointer;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}
.task-icon {
  font-size: 24px;
}

.task-icon__delete {
  font-size: 24px;
}

.task-icon__menu {
  font-size: 24px;
}

/* Estilo del tooltip */
.tooltip {
  visibility: hidden;
  background-color: rgba(104, 102, 102, 0.939);
  color: #fff;
  text-align: center;
  width: 49%;
  height: 47%;
  margin-top: 5px;
  padding: 10px;
  font-size: 14px;
  position: absolute;
  top: 30px;
  left: 50%;
  z-index: 10;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Mostrar tooltip en hover */
.tooltip-container:hover .tooltip {
  visibility: visible;
}
</style>
