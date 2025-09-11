import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading time (3 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
      // Navigate to user type selection after animation completes
      navigate('/select-user-type');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="w-full h-full flex items-center justify-center">
        <video 
          autoPlay 
          muted 
          playsInline 
          className="w-full max-w-2xl h-auto"
        >
          <source src="/NyayPreloadAnimation.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Preloader;
