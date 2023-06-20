import Add from 'Assets/icons/add.svg'
import TopBar from 'Components/topBar'
import Hero from './components/hero'
import Menu from './components/menu'
import Readiness from './components/readiness'
import Inovator from './components/inovator'
import Container from 'Components/container'
import { useNavigate } from 'react-router-dom'
import { paths } from 'Consts/path'
import { FloatingButton } from './_homeStyle'
import useAuthLS from 'Hooks/useAuthLS'

function Home() {
  const navigate = useNavigate()
  const { auth } = useAuthLS()
  const { role } = auth || {}
  return (
    <Container page>
      <TopBar includeLogin title='Innovilage' onLogin={() => navigate(paths.LOGIN_PAGE)} position='space-between' />
      <Hero />
      <Menu />
      <Readiness />
      <Inovator />
      {role === 'innovator' && (
        <FloatingButton onClick={() => navigate(paths.ADD_INNOVATION)}>
          <img src={Add} width={20} height={20} alt='add icon' />
        </FloatingButton>
      )}
    </Container>
  )
}

export default Home
