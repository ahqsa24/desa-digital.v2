import Home from 'Assets/icons/home.svg'
import HomeActive from 'Assets/icons/home-active.svg'
import Village from 'Assets/icons/village.svg'
import VillageActive from 'Assets/icons/village-active.svg'
import User from 'Assets/icons/user.svg'
import UserActive from 'Assets/icons/user-active.svg'
import { paths } from 'Consts/path'
import { useLocation, useNavigate } from 'react-router-dom'
import { OuterContainer, Container, GridContainer, GridItem, Text } from './_navbarStyle'

const menu = [
  {
    icon: Home,
    active: HomeActive,
    label: 'Beranda',
    path: paths.LANDING_PAGE,
  },
  {
    icon: Village,
    active: VillageActive,
    label: 'Desa Digital',
    path: paths.VILLAGE_PAGE,
  },
  {
    icon: User,
    active: UserActive,
    label: 'Inovator',
    path: paths.INNOVATOR_PAGE,
  },
]

const show = [paths.LANDING_PAGE, paths.VILLAGE_PAGE, paths.INNOVATOR_PAGE, paths.ADMIN_PAGE]

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  if (!show.includes(pathname)) return null

  return (
    <OuterContainer>
      <Container>
        <GridContainer>
          {menu.map(({ icon, active, label, path }, idx) => (
            <GridItem key={idx} onClick={() => navigate(path)}>
              <img src={pathname === path ? active : icon} alt={label} width={20} height={20} />
              <Text>{label}</Text>
            </GridItem>
          ))}
        </GridContainer>
      </Container>
    </OuterContainer>
  )
}

export default Navbar
