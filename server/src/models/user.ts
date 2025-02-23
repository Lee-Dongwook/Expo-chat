export interface User {
  id: string;
  username: string;
  password: string;
}

export const users: User[] = [
  { id: "1", username: "testuser", password: "testpass" },
];
