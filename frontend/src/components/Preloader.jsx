import { useEffect, useState } from 'react';

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (3 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
