// src/components/VideoBackground/VideoBackground.jsx
import './VideoBackground.css';

const VideoBackground = () => {
  return (
    <div className="video-background">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="background-video"
      >
        {/* ADD YOUR BACKGROUND VIDEO FILE PATH HERE */}
        {/* <source src="/videos/background.mp4" type="video/mp4" /> */}
        {/* <source src="/videos/background.webm" type="video/webm" /> */}
        
        {/* Fallback image if video doesn't load */}
        <div className="video-fallback">
          <div className="fallback-pattern"></div>
        </div>
      </video>
      
      {/* Overlay for better readability */}
      <div className="video-overlay"></div>
    </div>
  );
};

export default VideoBackground;