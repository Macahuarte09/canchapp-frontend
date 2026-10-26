// Lee los datos del usuario guardados en el token JWT (id, email, nombre)
export function getUsuario() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

export function getUsuarioId() {
  return getUsuario()?.id ?? null;
}
