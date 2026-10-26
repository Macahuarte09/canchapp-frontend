import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getUsuario } from '../utils/auth';

const API = 'https://canchapp-158d.vercel.app/api';
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function Inicio() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const usuario = getUsuario();
  const usuarioId = usuario?.id ?? null;
  const nombre = usuario?.nombre?.split(' ')[0] || 'jugador/a';
  const hoy = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

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

  const nombreCancha = (id) => canchas.find((c) => c.id === id)?.nombre ?? `Cancha ${id}`;
  const proximas = reservas
    .filter((r) => r.estado !== 'cancelada' && String(r.fecha).slice(0, 10) >= hoy)
    .sort((a, b) => (String(a.fecha).slice(0, 10) + a.hora_inicio).localeCompare(String(b.fecha).slice(0, 10) + b.hora_inicio))
    .slice(0, 3);

  if (!usuarioId) return null;

  return (
    <>
      <Navbar />
      <main className="page">
        <section className="hero">
          <p className="hero-hola">Hola,</p>
          <h1>{nombre}</h1>
          <p>¿Listo para tu próximo partido?</p>
          <button className="btn btn-grande" onClick={() => navigate('/reservar')}>Reservar cancha</button>
        </section>

        <div className="seccion-head">
          <h3>Tus próximas reservas</h3>
          <button className="link-btn" onClick={() => navigate('/reservas')}>Ver todas</button>
        </div>
        {!cargando && proximas.length === 0 && <p className="vacio">Todavía no tenés reservas próximas.</p>}
        <div className="reservas">
          {proximas.map((r) => {
            const [, mes, dia] = String(r.fecha).slice(0, 10).split('-');
            return (
              <article key={r.id} className="reserva">
                <div className="reserva-fecha">
                  <strong>{dia}</strong>
                  <span>{MESES[Number(mes) - 1]}</span>
                </div>
                <div className="reserva-info">
                  <h3>{nombreCancha(r.cancha_id)}</h3>
                  <p>{String(r.hora_inicio).slice(0, 5)} a {String(r.hora_fin).slice(0, 5)}</p>
                </div>
                <span className={`badge badge-${r.estado}`}>{r.estado}</span>
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}

export default Inicio;
