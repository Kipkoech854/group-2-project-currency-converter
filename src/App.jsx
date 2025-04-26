import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConverterForm from './components/ConverterForm';
import HistoryGraphPage from './HistoryGraphPage';
import FavoritesPage from './FavouritesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ConverterForm />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </Router>
  );
}

export default App;