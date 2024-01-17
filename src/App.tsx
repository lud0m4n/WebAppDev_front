import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage.tsx';
import PeriodPage from './pages/PeriodPage/PeriodPage.tsx';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage.tsx';
import AllFossilsPage from './pages/AllFossilsPage/AllFossilsPage.tsx';
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage.tsx';
import CreatePage from "./pages/CreatePage/CreatePage.tsx"
import EditPage from './pages/EditPage/EditPage.tsx';
import AllFossilsAdminPage from './pages/AllFossilsAdminPage/AllFossilsAdminPage.tsx';
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
          <Route path="/WebAppDev_front/fossils" element={<AllFossilsAdminPage />} />
          : <Route path="/WebAppDev_front/fossils" element={<AllFossilsPage />} />}
         <Route path="/WebAppDev_front/fossil/:id" element={<ShoppingCartPage />} />
         <Route path="/WebAppDev_front/period/create" element={<CreatePage />} />
         <Route path="/WebAppDev_front/period/:periodId/edit" element={<EditPage />} />
        <Route path="/WebAppDev_front/auth/login" element={<LoginPage />} />
        <Route path="/WebAppDev_front/auth/registration" element={<RegistrationPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
