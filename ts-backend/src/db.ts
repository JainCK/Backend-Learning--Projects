import { User } from "./models/user";

const users: User[] = [];

export const addUser = (user: User) => {
  users.push(user);
};

export const getUserById = (id: number): User | undefined => {
  return users.find((user) => user.id === id);
};
