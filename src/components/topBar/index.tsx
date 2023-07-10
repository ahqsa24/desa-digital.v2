import Back from 'Assets/icons/back.svg'
import Profile from 'Assets/icons/profile.svg'
import Logout from 'Assets/icons/logout.svg'
import useAuthLS from 'Hooks/useAuthLS'
import { useNavigate } from 'react-router'
import { paths } from 'Consts/path'
import { Container, Icon, Content, Title, Login, AuthContainer } from './_topBarStyle'

type TopBarProps = {
  title: string | undefined
  position?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'initial'
    | 'inherit'
  includeLogin?: boolean
  onBack?: () => void
  onLogin?: () => void
}

function TopBar(props: TopBarProps) {
  const { title, position = 'flex-start', includeLogin, onBack, onLogin } = props
  const navigate = useNavigate()

  const { auth, removeAuth } = useAuthLS()
  const isEmpty = Object.keys(auth || {}).length === 0

  const onProfileClick = () => {
    if (isEmpty) return

    const { role } = auth || {}
    if (role === 'innovator') navigate(paths.INNOVATOR_PROFILE_PAGE)
    if (role === 'village') navigate(paths.VILLAGE_PROFILE_PAGE)
  }

  const onLogout = () => {
    removeAuth()
  }

  return (
    <Container>
      <Content position={position}>
        {!!onBack && <Icon src={Back} alt='back icon' width={16} height={16} onClick={onBack} />}
        <Title>{title}</Title>
        {!!includeLogin && isEmpty && <Login onClick={onLogin}>Login</Login>}

        {!!includeLogin && !isEmpty && (
          <AuthContainer>
            <Icon src={Profile} alt='profile icon' width={18} height={18} onClick={onProfileClick} />
            <Icon src={Logout} alt='logout icon' width={18} height={18} onClick={onLogout} />
          </AuthContainer>
        )}
      </Content>
    </Container>
  )
}

export default TopBar
