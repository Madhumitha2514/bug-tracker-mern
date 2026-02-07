import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import DashboardLayout from "./layout/DashboardLayout";
import Tickets from "./pages/Tickets";
import Dashboard from "./pages/Dashboard";

import AllTickets from './pages/AllTickets';
import MembersPage from './pages/Members';
import Settings from './pages/Settings';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<Tickets />} />
        <Route path="/tickets" element={<AllTickets />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/settings" element={<Settings />} />

      </Route>
    </Routes>
  );
}

export default App;
