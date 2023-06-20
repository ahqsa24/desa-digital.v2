import './App.css'
import Navbar from './components/navbar'
import Home from './pages/home'
import Category from './pages/category'
import Village from './pages/village'
import { paths } from 'Consts/path'
import Inovator from './pages/innovator'
import Login from './pages/login'
import Register from './pages/register'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import DetailInnovation from './pages/detailInnovation'
import DetailVillage from './pages/detailVillage'
import DetailInnovator from './pages/detailInnovator'
import AddInnovator from './pages/addInnovator'
import AddInnovation from './pages/addInnovation'
import AddVillage from './pages/addVillage'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify';


const queryClient = new QueryClient()

const routes = [
  {
    path: paths.LANDING_PAGE,
    element: <Home />,
    exact: true,
  },
  {
    path: paths.INNOVATION_PAGE,
    element: <Category />,
    exact: true,
  },
  {
    path: paths.INNOVATION_CATEGORY_PAGE,
    element: <Category />,
    exact: true,
  },
  {
    path: paths.VILLAGE_PAGE,
    element: <Village />,
    exact: true,
  },
  {
    path: paths.INOVATOR_PAGE,
    element: <Inovator />,
    exact: true,
  },
  {
    path: paths.LOGIN_PAGE,
    element: <Login />,
    exact: true,
  },
  {
    path: paths.REGISTER_PAGE,
    element: <Register />,
    exact: true,
  },
  {
    path: paths.DETAIL_INNOVATION_PAGE,
    element: <DetailInnovation />,
    exact: true,
  },
  {
    path: paths.DETAIL_VILLAGE_PAGE,
    element: <DetailVillage />,
    exact: true,
  },
  {
    path: paths.DETAIL_INNOVATOR_PAGE,
    element: <DetailInnovator />,
    exact: true,
  },
  {
    path: paths.ADD_INNOVATOR,
    element: <AddInnovator />,
    exact: true,
  },
  {
    path: paths.ADD_INNOVATION,
    element: <AddInnovation />,
    exact: true,
  },
  {
    path: paths.ADD_VILLAGE,
    element: <AddVillage />,
    exact: true,
  },
]

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <main>
          <Routes>
            {routes.map((data, idx) => (
              <Route key={idx} {...data} />
            ))}
          </Routes>
          <Navbar />
        </main>
      </BrowserRouter>
      <ToastContainer />
    </QueryClientProvider>
  )
}

export default App
