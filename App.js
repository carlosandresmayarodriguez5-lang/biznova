import React, { useState } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import EnviosScreen from './src/screens/EnviosScreen';
import FinanzasScreen from './src/screens/FinanzasScreen';
import EquipoScreen from './src/screens/EquipoScreen'; // Asegúrate de tener este archivo creado
import FlujoScreen from './src/screens/FlujoScreen';   // Asegúrate de tener este archivo creado

export default function App() {
  const [vistaActual, setVistaActual] = useState('home');

  if (vistaActual === 'envios') {
    return <EnviosScreen onVolver={() => setVistaActual('home')} />;
  }

  if (vistaActual === 'finanzas') {
    return <FinanzasScreen onVolver={() => setVistaActual('home')} />;
  }

  if (vistaActual === 'equipo') {
    return <EquipoScreen onVolver={() => setVistaActual('home')} />;
  }

  if (vistaActual === 'flujo') {
    return <FlujoScreen onVolver={() => setVistaActual('home')} />;
  }

  return (
    <HomeScreen 
      onNavigate={(pantalla) => setVistaActual(pantalla)} 
    />
  );
}