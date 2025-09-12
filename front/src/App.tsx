import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            ChefMax LATAM
          </div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
            Sistema de Gestión de Inventarios
          </h1>
          <p className="mt-2 text-gray-500">
            ¡Aplicación desplegada exitosamente en DigitalOcean App Platform!
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✅ Producción
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;