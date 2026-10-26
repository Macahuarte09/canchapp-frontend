import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Canchas from './pages/Canchas';
import Reservas from './pages/Reservas';
import NuevaReserva from './pages/NuevaReserva';
import Inicio from './pages/Inicio';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/canchas" element={<Canchas />} />
        <Route path="/reservar" element={<NuevaReserva />} />
        <Route path="/reservas" element={<Reservas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
