export interface User {
  id: string;
  username: string;
  password: string;
}

export interface OnlineUser {
  id: string;
  username: string;
  lastActive: Date;
}

export const users: User[] = [
  { id: "1", username: "testuser", password: "testpass" },
];

export const onlineUsers: { [id: string]: OnlineUser } = {};
