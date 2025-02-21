import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import type { Task } from '@/interfaces/taskForm';

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
  }),

  actions: {
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
          status: task.completed
            ? task.inProgress
              ? 'In Progress'
              : 'Done'
            : 'To Do',
        }));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
