import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './shared/ui/templates/AppLayout';
import { EnrollmentSearch } from './pages/EnrollmentSearchPage';
import { EnrollmentDetail } from './pages/EnrollmentDetailPage';
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
