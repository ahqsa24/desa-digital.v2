import api from './api'

export const addInnovation = async (body: any): Promise<any> => await api.post('/innovations', body)
