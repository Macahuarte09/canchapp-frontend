import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API = 'https://canchapp-backend-4cdk-red.vercel.app/api';
const TIPOS = { padel: 'Pádel', pelota_paleta: 'Pelota paleta' };

const traerCanchas = () => axios.get(`${API}/canchas`).then((res) => res.data);

function AdminCanchas() {
  const [canchas, setCanchas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('padel');
  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [canchaEditando, setCanchaEditando] = useState(null);
  const [nombreEdit, setNombreEdit] = useState('');
  const [tipoEdit, setTipoEdit] = useState('padel');
  const [precioEdit, setPrecioEdit] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
      return;
    }
    traerCanchas()
      .then(setCanchas)
      .catch((err) => console.error(err));
  }, [navigate]);

  const handleAgregar = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await axios.post(`${API}/canchas`, {
        nombre,
        tipo,
        precio_por_hora: Number(precio)
      });
      setNombre('');
      setTipo('padel');
      setPrecio('');
      setMensaje('Cancha agregada.');
      setCanchas(await traerCanchas());
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'No se pudo agregar la cancha. Intentá de nuevo.');
    }
  };

  const handleEliminar = async (cancha) => {
    if (!window.confirm(`¿Eliminar "${cancha.nombre}"?`)) return;
    setMensaje('');
    setError('');
    try {
      await axios.delete(`${API}/canchas/${cancha.id}`);
      setMensaje('Cancha eliminada.');
      setCanchas(await traerCanchas());
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar la cancha. Si ya tiene reservas, no se puede borrar.');
    }
  };

  const handleEditar = (cancha) => {
    setCanchaEditando(cancha.id);
    setNombreEdit(cancha.nombre);
    setTipoEdit(cancha.tipo);
    setPrecioEdit(cancha.precio_por_hora);
  };

  const handleGuardarEdicion = async (id) => {
    setMensaje('');
    setError('');
    try {
      await axios.put(`${API}/canchas/${id}`, {
        nombre: nombreEdit,
        tipo: tipoEdit,
        precio_por_hora: Number(precioEdit),
        activa: true
      });
      setMensaje('Cancha actualizada.');
      setCanchaEditando(null);
      setCanchas(await traerCanchas());
    } catch (err) {
      setError('No se pudo actualizar la cancha.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-head">
          <h2>Administrar canchas</h2>
          <p>Agregá, editá o eliminá las canchas.</p>
        </div>

        <div className="panel" style={{ marginBottom: '28px' }}>
          {mensaje && <p className="msg msg-ok">{mensaje}</p>}
          {error && <p className="msg msg-error">{error}</p>}
          <form onSubmit={handleAgregar}>
            <div className="field">
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="row-2">
              <div className="field">
                <label htmlFor="tipo">Tipo</label>
                <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="padel">Pádel</option>
                  <option value="pelota_paleta">Pelota paleta</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="precio">Precio por hora</label>
                <input id="precio" type="number" min="0" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
              </div>
            </div>
            <button className="btn btn-full" type="submit">Agregar cancha</button>
          </form>
        </div>

        <div className="seccion-head">
          <h3>Canchas cargadas</h3>
        </div>
        {canchas.length === 0 && <p className="vacio">Todavía no hay canchas cargadas.</p>}
        <div className="reservas">
          {canchas.map((c) => (
            <article key={c.id} className="reserva">
              {canchaEditando === c.id ? (
                <div className="reserva-info">
                  <input type="text" value={nombreEdit} onChange={(e) => setNombreEdit(e.target.value)} />
                  <select value={tipoEdit} onChange={(e) => setTipoEdit(e.target.value)}>
                    <option value="padel">Pádel</option>
                    <option value="pelota_paleta">Pelota paleta</option>
                  </select>
                  <input type="number" value={precioEdit} onChange={(e) => setPrecioEdit(e.target.value)} />
                  <button className="btn" onClick={() => handleGuardarEdicion(c.id)}>Guardar</button>
                  <button className="btn btn-outline" onClick={() => setCanchaEditando(null)}>Cancelar</button>
                </div>
              ) : (
                <>
                  <div className="reserva-info">
                    <h3>{c.nombre}</h3>
                    <p>{TIPOS[c.tipo] || c.tipo} · ${Number(c.precio_por_hora).toLocaleString('es-AR')}/hora</p>
                  </div>
                  <div className="reserva-acciones">
                    {c.activa === 0 && <span className="badge badge-cancelada">inactiva</span>}
                    <button className="btn btn-outline" onClick={() => handleEditar(c)}>Editar</button>
                    <button className="btn btn-outline" onClick={() => handleEliminar(c)}>Eliminar</button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </main>
    </>
  );
}

export default AdminCanchas;