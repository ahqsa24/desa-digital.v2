import { useLocalStorage } from 'react-use'

type Auth = {
  id?: string
  email?: string
  role?: string
}

function useAuthLS() {
  const [auth, setAuth, remove] = useLocalStorage<Auth>('auth', {})

  return { auth, setAuth, removeAuth: remove }
}

export default useAuthLS