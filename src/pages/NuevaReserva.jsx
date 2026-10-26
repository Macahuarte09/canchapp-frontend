import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getUsuarioId } from '../utils/auth';

const API = 'https://canchapp-158d.vercel.app/api';

function NuevaReserva() {
  const location = useLocation();
  const navigate = useNavigate();
  const [canchas, setCanchas] = useState([]);
  const [canchaId, setCanchaId] = useState(location.state?.canchaId ?? '');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [mensaje, setMensaje] = useState('');

  const token = localStorage.getItem('token');
  const usuarioId = token ? getUsuarioId(token) : null;
  const hoy = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  useEffect(() => {
    if (!usuarioId) {
      navigate('/');
      return;
    }
    axios.get(`${API}/canchas`)
      .then((res) => setCanchas(res.data.filter((c) => c.activa !== 0)))
      .catch((err) => console.error(err));
  }, [usuarioId, navigate]);

  const handleReserva = async (e) => {
    e.preventDefault();
    setMensaje('');
    if (horaFin <= horaInicio) {
      setMensaje('La hora de fin tiene que ser posterior a la de inicio.');
      return;
    }
    try {
      await axios.post(`${API}/reservas`, {
        usuario_id: usuarioId,
        cancha_id: canchaId,
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin
      });
      navigate('/reservas');
    } catch (err) {
      setMensaje(err.response?.data?.error || 'No se pudo crear la reserva. Intentá de nuevo.');
    }
  };

  if (!usuarioId) return null;

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-head">
          <h2>Reservar cancha</h2>
        </div>
        <div className="panel">
          {mensaje && <p className="msg msg-error">{mensaje}</p>}
          <form onSubmit={handleReserva}>
            <div className="field">
              <label htmlFor="cancha">Cancha</label>
              <select id="cancha" value={canchaId} onChange={(e) => setCanchaId(e.target.value)} required>
                <option value="">Elegí una cancha</option>
                {canchas.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre} - ${Number(c.precio_por_hora).toLocaleString('es-AR')}/hora</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="fecha">Fecha</label>
              <input id="fecha" type="date" min={hoy} value={fecha} onChange={(e) => setFecha(e.target.value)} required />
            </div>
            <div className="row-2">
              <div className="field">
                <label htmlFor="desde">Desde</label>
                <input id="desde" type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="hasta">Hasta</label>
                <input id="hasta" type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} required />
              </div>
            </div>
            <button className="btn btn-full" type="submit">Confirmar reserva</button>
          </form>
        </div>
      </main>
    </>
  );
}

export default NuevaReserva;
