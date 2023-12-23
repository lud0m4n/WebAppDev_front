import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage.tsx';
import PeriodPage from './pages/PeriodPage/PeriodPage.tsx';

const App = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/period/:id" element={<PeriodPage />} />
      </Routes>
    </Router>
  );
};

export default App;
