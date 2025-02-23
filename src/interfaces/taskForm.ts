export interface Task {
  id: number;
  title: string;
  assignee: string;
  description: string;
  status: string | 'To Do' | 'In Progress' | 'Done';
}
