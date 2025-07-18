import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from "./components/login";
import Home from './components/home';
import ProtectedRoute from './components/ProtectedRoute';
import Users from './components/users';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/login']; 

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<Users />} />
          {/* <Route path="/data" element={<div>Data Page</div>} /> */}
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
