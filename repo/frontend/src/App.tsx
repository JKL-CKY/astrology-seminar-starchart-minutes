import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SeminarPage from './pages/SeminarPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/seminar/:id" element={<SeminarPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
