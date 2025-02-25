import { defineStore } from 'pinia';
import axios from 'axios';
import type { Task } from '@/interfaces/taskForm';
import { FORM_INITIAL } from '@/constants/formInitial';

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [] as Task[],
    currentTask: { ...FORM_INITIAL } as Task,
    loading: false,
  }),

  actions: {
    saveTask() {
      const save = JSON.stringify(this.tasks);
      localStorage.setItem('task', save);
    },

    recoverTask() {
      const recover = localStorage.getItem('task');
      this.tasks = recover ? (JSON.parse(recover) as Task[]) : [];
    },

    async fetchTasks() {
      this.loading = true;
      try {
        const { data } = await axios.get(
          'https://jsonplaceholder.typicode.com/todos?_limit=3'
        );

        this.tasks = data.map((task: any) => ({
          id: task.id,
          title: task.title,
          assignee: ` alex`,
          description: 'No hay descripción disponible',
          status: task.completed ? 'Done' : 'To Do',
        }));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        this.loading = false;
      }
    },

    async addTask(data: Task) {
      try {
        if (data) {
          data.id = Math.floor(Math.random() * 300);
          this.tasks.push(data);
          this.saveTask();
        }
      } catch (error) {
        console.log('ha fallado la creacion de la tarea', error);
      }
    },

    async updateTask(data: Task) {
      try {
        const index = this.tasks.findIndex((t) => t.id === data.id);
        if (index !== -1) {
          this.tasks.splice(index, 1, data);
          this.saveTask();
        }
      } catch (error) {
        console.log('error al actualizar la tareas', error);
      }
    },

    async deleteTask(id: number) {
      try {
        this.tasks = this.tasks.filter((t) => t.id !== id);
        this.saveTask();
      } catch (error) {
        console.log('error al eliminar la tarea', error);
      }
    },

    resetCurrentForm() {
      Object.assign(this.currentTask, { ...FORM_INITIAL });
    },
  },
});
