import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage.tsx';
import PeriodPage from './pages/PeriodPage/PeriodPage.tsx';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage.tsx';
import AllRequestsPage from './pages/AllRequestsPage/AllRequestsPage.tsx';
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage.tsx';
import CreatePage from "./pages/CreatePage/CreatePage.tsx"
import EditPage from './pages/EditPage/EditPage.tsx';
import AllRequestsAdminPage from './pages/AllRequestsAdminPage/AllRequestsAdminPage.tsx';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import TableMainPage from './pages/TableMainPage/TableMainPage.tsx'

const App = () => {
  const role = localStorage.getItem("role");
  console.log(role);
  return (
    <BrowserRouter>
      <Routes>
      {role === "модератор" ?
          <Route path="/WebAppDev_front/main-page/admin" element={<TableMainPage />} /> : null}
          <Route path="/WebAppDev_front" element={<MainPage />} />
        <Route path="/WebAppDev_front/period/:id" element={<PeriodPage />} />
        {role === "модератор" ?
          <Route path="/WebAppDev_front/requests" element={<AllRequestsAdminPage />} />
          : <Route path="/WebAppDev_front/requests" element={<AllRequestsPage />} />}
         <Route path="/WebAppDev_front/request/:id" element={<ShoppingCartPage />} />
         <Route path="/WebAppDev_front/period/create" element={<CreatePage />} />
         <Route path="/WebAppDev_front/period/:periodId/edit" element={<EditPage />} />
        <Route path="/WebAppDev_front/auth/login" element={<LoginPage />} />
        <Route path="/WebAppDev_front/auth/registration" element={<RegistrationPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
