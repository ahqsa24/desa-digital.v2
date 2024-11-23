import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Innovation from "./pages/innovation";
import Village from "./pages/village";
import { paths } from "Consts/path";
import Innovator from "./pages/innovator";
import Login from "./pages/login";
import Register from "./pages/register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import DetailInnovation from "./pages/innovation/detail";
import DetailVillage from "./pages/village/detail";
import DetailInnovator from "./pages/innovator/detail";
// import ProfileInnovator from "./pages/innovator/form
import AddInnovation from "./pages/innovation/add";
import ProfileFormRegist from "./pages/village/form";
import ProfileInnovator from "./pages/innovator/profile";
import { ToastContainer } from "react-toastify";
import InnovatorForm from "./pages/innovator/form";
import EditInnovation from "./pages/innovation/edit";
import Notification from "./pages/notification/Notification"
import ResetPassword from "./pages/resetpassword/ResetPassword";
import EmailReset from "./pages/emailreset/EmailReset";
import NewPassword from "./pages/resetpassword/newpassword/NewPassword";
import ProfileVillage from "./pages/village/profile";
import KlaimInovasi from "./pages/village/klaimInovasi";


const queryClient = new QueryClient();

const routes = [
  {
    path: paths.LANDING_PAGE,
    element: <Home />,
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
    path: paths.VILLAGE_PAGE,
    element: <Village />,
    exact: true,
  },
  {
    path: paths.VILLAGE_PROFILE_REGIST_PAGE,
    element: <ProfileFormRegist />,
    exact: true,
  },
  {
    path: paths.INNOVATOR_PROFILE_PAGE,
    element: <ProfileInnovator />,
    exact: true,
  },
  {
    path: paths.DETAIL_VILLAGE_PAGE,
    element: <DetailVillage />,
    exact: true,
  },
  {
    path: paths.INNOVATOR_PAGE,
    element: <Innovator />,
    exact: true,
  },

  {
    path: paths.DETAIL_INNOVATOR_PAGE,
    element: <DetailInnovator />,
    exact: true,
  },
  {
    path: paths.INNOVATION_PAGE,
    element: <Innovation />,
    exact: true,
  },
  {
    path: paths.ADD_INNOVATION,
    element: <AddInnovation />,
    exact: true,
  },
  {
    path: paths.INNOVATION_CATEGORY_PAGE,
    element: <Innovation />,
    exact: true,
  },
  {
    path: paths.DETAIL_INNOVATION_PAGE,
    element: <DetailInnovation />,
    exact: true,
  },
  {
    path: paths.EDIT_INNOVATION_PAGE,
    element: <EditInnovation />,
    exact: true,
  },
  {
    path: paths.INNOVATOR_FORM,
    element: <InnovatorForm />,
    exact: true,
  },
  {
    path: paths.RESET_PASSWORD_PAGE,
    element: <ResetPassword />,
    exact: true,
  },
  {
    path: paths.NOTIFICATION_PAGE,
    element: <Notification />,
    exact: true,
  },
  {
    path: paths.VILLAGE_PROFILE_PAGE,
    element: <ProfileVillage />,
  },
  {
    path: paths.EMAIL_RESET_PASSWORD_PAGE,
    element: <EmailReset />,
    exact: true,
  },
  {
    path: paths.NEW_PASSWORD_PAGE,
    element: <NewPassword />,
    exact: true,
  },
  {
    path: paths.KLAIM_INOVASI_PAGE,
    element: <KlaimInovasi />,
    exact: true,
  }
];

const App: React.FC = () => {
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
  );
}

export default App;
