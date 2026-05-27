import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { EnrollmentSearch } from './pages/EnrollmentSearch';
import { EnrollmentDetail } from './pages/EnrollmentDetail';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/enrollment" replace />} />
          <Route path="enrollment" element={<EnrollmentSearch />} />
          <Route path="student/:id/enrollment" element={<EnrollmentDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
