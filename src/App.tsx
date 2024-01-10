import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage.tsx';
import PeriodPage from './pages/PeriodPage/PeriodPage.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/WebAppDev_front" element={<MainPage />} />
        <Route path="/WebAppDev_front/period/:id" element={<PeriodPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
