import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Preloader from './components/Preloader';
import Mainroutes from './routes/Mainroutes';

const App = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const location = useLocation();

  // Hide preloader after first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Show preloader only on initial load and not on route changes
  if (showPreloader && location.pathname === '/') {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Mainroutes/>
    </div>
  );
};

export default App;