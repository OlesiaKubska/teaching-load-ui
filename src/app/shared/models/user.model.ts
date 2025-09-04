export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'teacher' | 'user';
  token?: string;
}