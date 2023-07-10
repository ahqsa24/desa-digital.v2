import api from "./api";

type Login = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: Login): Promise<any> =>
  await api.get("/users", { params: { email, password } });
export const register = async (body: any): Promise<any> =>
  await api.post("/users", body);
