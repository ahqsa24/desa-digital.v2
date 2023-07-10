import api from "./api";

export const updateProfile = async ({ id, data }: { id?: string; data: any }) =>
  await api.patch(`/users/${id}`, data);

export const getUserById = async (id?: string) => await api.get(`/users/${id}`);

export const getUsers = async () => await api.get("/users");
