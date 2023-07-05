import api from './api'

export const addInnovation = async (body: any): Promise<any> => await api.post('/innovations', body)
// await api.get('/innovation', { params: { email, password } })
// export const register = async (body: any): Promise<any> => await api.post('/users', body)

