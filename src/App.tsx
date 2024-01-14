import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage.tsx';
import PeriodPage from './pages/PeriodPage/PeriodPage.tsx';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage.tsx';
import AllRequestsPage from './pages/AllRequestsPage/AllRequestsPage.tsx';
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/WebAppDev_front" element={<MainPage />} />
        <Route path="/WebAppDev_front/period/:id" element={<PeriodPage />} />
        <Route path="/WebAppDev_front/requests" element={<AllRequestsPage />} />
        <Route path="/WebAppDev_front/shopping-cart" element={<ShoppingCartPage />} />
        <Route path="/WebAppDev_front/auth/login" element={<LoginPage />} />
        <Route path="/WebAppDev_front/auth/registration" element={<RegistrationPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
