import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getUsuarioId } from '../utils/auth';

const API = 'https://canchapp-158d.vercel.app/api';
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const usuarioId = token ? getUsuarioId(token) : null;

  useEffect(() => {
    if (!usuarioId) {
      navigate('/');
      return;
    }
    axios.get(`${API}/canchas`)
      .then((res) => setCanchas(res.data))
      .catch((err) => console.error(err));
    axios.get(`${API}/reservas/usuario/${usuarioId}`)
      .then((res) => setReservas(res.data))
      .catch((err) => console.error(err))
      .finally(() => setCargando(false));
  }, [usuarioId, navigate]);

  const handleCancelar = async (id) => {
    try {
      await axios.put(`${API}/reservas/cancelar/${id}`);
      setReservas(reservas.map((r) => (r.id === id ? { ...r, estado: 'cancelada' } : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const nombreCancha = (id) => canchas.find((c) => c.id === id)?.nombre ?? `Cancha ${id}`;
  const ordenadas = [...reservas].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));

  if (!usuarioId) return null;

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-head">
          <h2>Mis reservas</h2>
        </div>
        {!cargando && reservas.length === 0 && (
          <div className="vacio">
            <p>Todavía no tenés reservas.</p>
            <button className="btn" onClick={() => navigate('/canchas')}>Reservar una cancha</button>
          </div>
        )}
        <div className="reservas">
          {ordenadas.map((r) => {
            const [, mes, dia] = String(r.fecha).slice(0, 10).split('-');
            return (
              <article key={r.id} className={`reserva ${r.estado === 'cancelada' ? 'reserva-cancelada' : ''}`}>
                <div className="reserva-fecha">
                  <strong>{dia}</strong>
                  <span>{MESES[Number(mes) - 1]}</span>
                </div>
                <div className="reserva-info">
                  <h3>{nombreCancha(r.cancha_id)}</h3>
                  <p>{String(r.hora_inicio).slice(0, 5)} a {String(r.hora_fin).slice(0, 5)}</p>
                </div>
                <div className="reserva-acciones">
                  <span className={`badge badge-${r.estado}`}>{r.estado}</span>
                  {r.estado !== 'cancelada' && (
                    <button className="btn btn-outline" onClick={() => handleCancelar(r.id)}>Cancelar</button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}

export default Reservas;
