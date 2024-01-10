import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage.tsx';
import PeriodPage from './pages/PeriodPage/PeriodPage.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/paleo" element={<MainPage />} />
        <Route path="/paleo/period/:id" element={<PeriodPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
