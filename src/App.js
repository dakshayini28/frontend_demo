import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/login";
import Home from './components/home';
import ProtectedRoute from './components/ProtectedRoute';
import Users from './components/users';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/connections" element={<div>Connections Page</div>} />
          <Route path="/data" element={<div>Data Page</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
