import api from './api'

export const login = async ({ email, password }: { email: string; password: string }): Promise<any> =>
  await api.get('/users', { params: { email, password } })
export const register = async (body: any): Promise<any> => await api.post('/users', body)
