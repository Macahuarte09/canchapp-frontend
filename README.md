# CanchApp - Frontend

Parte visual de CanchApp, una app para reservar turnos de canchas de pádel y pelota paleta. Hecha como trabajo final para la Práctica Supervisada (PPS).

Consume la API que está en el repositorio del backend: https://github.com/Macahuarte09/canchapp-backend

## Links

- App desplegada: https://canchapp-blue.vercel.app
- API: https://canchapp-backend-4cdk-red.vercel.app/api

## Qué usé

- React
- Vite
- React Router (para moverse entre pantallas)
- Axios (para hacer las llamadas a la API)

## Pantallas

- **Login** y **Registro**
- **Inicio**: saluda al usuario y muestra sus próximas reservas
- **Canchas**: lista de canchas disponibles con su precio por hora
- **Reservar**: formulario para elegir cancha, fecha y horario
- **Mis reservas**: lista de reservas con opción de cancelarlas

## Carpetas

```
src/
├── components/   ← Navbar
├── pages/        ← las pantallas
├── utils/        ← auth.js (lee los datos del usuario desde el token)
├── App.jsx       ← las rutas de la app
└── main.jsx
```

## Cómo correrlo en tu compu

Necesitás tener instalado Node.js.

```bash
git clone https://github.com/Macahuarte09/canchapp-frontend.git
cd canchapp-frontend
npm install
npm run dev
```

Se abre en http://localhost:5173

## Conexión con la API

Por defecto el frontend usa la API que está en Vercel. La dirección está en la constante `API` que está arriba de cada archivo de `src/pages/`.

Para probarlo con el backend local (que corre en `http://localhost:3000`), cambiá esa constante por `/api`. Vite ya redirige esas llamadas al backend (está configurado en `vite.config.js`).

## Deploy

Está subido a Vercel. El archivo `vercel.json` sirve para que funcionen las rutas de React Router al recargar la página.
