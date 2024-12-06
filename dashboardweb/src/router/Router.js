import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from '../screens/Homepage/Homepage';
import Login from '../../src/screens/Login/Login';
import Dashboard from '../../src/screens/Dashboard/Dashboard';
import Users from "../screens/Users/Users"
import ModalAdd from '../components/Modals/Users/ModalAdd';
import ModalEdit  from '../components/Modals/Users/ModalEdit';
import Products from '../screens/Products/Products';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} /> 
        <Route path="/add_u" element={<ModalAdd/>}/>
        <Route path="/edit_u" element={<ModalEdit/>}/>
        <Route path="/products" element={<Products/>}/>
      </Routes>
    </Router>
  );
}

export default App;
