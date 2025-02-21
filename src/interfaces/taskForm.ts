export interface Task {
  id: number;
  title: string;
  assignee: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
}
