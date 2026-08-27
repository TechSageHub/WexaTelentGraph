import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Candidates } from './pages/Candidates';
import { CandidateDetails } from './pages/CandidateDetails';
import { Shortlist } from './pages/Shortlist';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/candidates/:candidateId" element={<CandidateDetails />} />
        <Route path="/shortlist" element={<Shortlist />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
