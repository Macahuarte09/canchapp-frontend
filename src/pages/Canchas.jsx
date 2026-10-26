import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API = 'https://canchapp-158d.vercel.app/api';
const TIPOS = { padel: 'Pádel', pelota_paleta: 'Pelota paleta' };

function Canchas() {
  const [canchas, setCanchas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
      return;
    }
    axios.get(`${API}/canchas`)
      .then((res) => setCanchas(res.data.filter((c) => c.activa !== 0)))
      .catch((err) => console.error(err))
      .finally(() => setCargando(false));
  }, [navigate]);

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-head">
          <h2>Canchas disponibles</h2>
          <p>Elegí una cancha y reservá tu horario.</p>
        </div>
        {!cargando && canchas.length === 0 && <p className="vacio">Todavía no hay canchas cargadas.</p>}
        <div className="canchas">
          {canchas.map((c) => (
            <article key={c.id} className="cancha">
              <div className={`court court-${c.tipo}`} aria-hidden="true">
                <span className="court-lines"></span>
              </div>
              <div className="cancha-body">
                <div className="cancha-head">
                  <div>
                    <h3>{c.nombre}</h3>
                    <p className="tipo">{TIPOS[c.tipo] || c.tipo}</p>
                  </div>
                  <p className="precio">${Number(c.precio_por_hora).toLocaleString('es-AR')}<small>/hora</small></p>
                </div>
                <button className="btn btn-full" onClick={() => navigate('/reservar', { state: { canchaId: c.id } })}>
                  Reservar
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}

export default Canchas;