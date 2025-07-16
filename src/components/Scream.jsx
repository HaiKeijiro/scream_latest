import { useState, useEffect, useRef } from 'react';

export default function Scream() {
  const [waterLevel, setWaterLevel] = useState(50); // Water level percentage (0-100)
  const [isScreaming, setIsScreaming] = useState(false);
  const [microphoneActive, setMicrophoneActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Microphone setup and audio analysis
  useEffect(() => {
    let mounted = true;

    const setupMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!mounted) return;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 256;
        microphone.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        microphoneRef.current = microphone;
        setMicrophoneActive(true);

        // Start audio analysis loop
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const analyzeAudio = () => {
          if (!mounted) return;
          
          analyser.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          const normalizedLevel = average / 255;
          
          setAudioLevel(normalizedLevel);
          
          // Determine if screaming (threshold-based detection)
          const screamThreshold = 0.30; // Adjust this value for sensitivity
          setIsScreaming(normalizedLevel > screamThreshold);
          
          animationFrameRef.current = requestAnimationFrame(analyzeAudio);
        };
        
        analyzeAudio();
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setMicrophoneActive(false);
      }
    };

    setupMicrophone();

    return () => {
      mounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Water level mechanics
  useEffect(() => {
    const interval = setInterval(() => {
      setWaterLevel(currentLevel => {
        if (isScreaming) {
          // Fill up quickly when screaming (responsive refill)
          return Math.min(100, currentLevel + 2.5);
        } else {
          // Slow drip when not screaming (natural leak)
          return Math.max(0, currentLevel - 0.3);
        }
      });
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [isScreaming]);

  const requestMicrophoneAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      window.location.reload(); // Refresh to restart with microphone access
    } catch (error) {
      alert('Microphone access is required for the water mechanic to work!');
    }
  };

  return (
    <div className="scream-container">
      {/* Background */}
      <div 
        className="background"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Water Container */}
      <div className="water-container">
        {/* Water Level */}
        <div 
          className="water-level"
          style={{
            height: `${waterLevel}%`,
            background: `linear-gradient(0deg, 
              rgba(64, 164, 223, 0.9) 0%, 
              rgba(100, 200, 255, 0.8) 50%, 
              rgba(150, 220, 255, 0.7) 100%)`
          }}
        />
        
        {/* Logo as water container visual */}
        <div className="logo-container">
          <img 
            src="/logo.png" 
            alt="Water Container" 
            className="water-logo"
            style={{
              filter: `opacity(${0.7 + (waterLevel / 100) * 0.3})`,
              transform: `scale(${0.95 + (waterLevel / 100) * 0.05})`
            }}
          />
        </div>
        
        {/* Water ripples effect when screaming */}
        {isScreaming && (
          <div className="water-ripples">
            <div className="ripple ripple-1"></div>
            <div className="ripple ripple-2"></div>
            <div className="ripple ripple-3"></div>
          </div>
        )}
      </div>

      {/* Status indicators */}
      <div className="status-panel">
        <div className="water-percentage">
          Water Level: {Math.round(waterLevel)}%
        </div>
        
        {microphoneActive ? (
          <div className="audio-indicator">
            <div className="mic-active">🎤 Listening...</div>
            <div className="audio-level-bar">
              <div 
                className="audio-level-fill"
                style={{ width: `${audioLevel * 100}%` }}
              />
            </div>
            {isScreaming && <div className="scream-indicator">🔊 SCREAMING!</div>}
          </div>
        ) : (
          <button onClick={requestMicrophoneAccess} className="mic-button">
            Enable Microphone
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="instructions">
        <p>🗣️ Scream to fill the water!</p>
        <p>🔇 Stay quiet and watch it drip away...</p>
      </div>

      <style jsx>{`
        .scream-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .water-container {
          position: relative;
          width: 300px;
          height: 400px;
          border: 4px solid #2c3e50;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .water-level {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          transition: height 0.1s ease-out;
          border-radius: 0 0 16px 16px;
          box-shadow: 0 -2px 10px rgba(64, 164, 223, 0.3);
        }

        .logo-container {
          position: relative;
          z-index: 3;
          transition: all 0.3s ease;
        }

        .water-logo {
          max-width: 200px;
          max-height: 200px;
          object-fit: contain;
          transition: all 0.3s ease;
        }

        .water-ripples {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 4;
        }

        .ripple {
          position: absolute;
          border: 2px solid rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: ripple-animation 1s infinite;
        }

        .ripple-1 {
          top: 20%;
          left: 30%;
          width: 40px;
          height: 40px;
          animation-delay: 0s;
        }

        .ripple-2 {
          top: 60%;
          left: 60%;
          width: 30px;
          height: 30px;
          animation-delay: 0.3s;
        }

        .ripple-3 {
          top: 40%;
          left: 10%;
          width: 35px;
          height: 35px;
          animation-delay: 0.6s;
        }

        @keyframes ripple-animation {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .status-panel {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 15px;
          border-radius: 10px;
          z-index: 5;
          min-width: 200px;
        }

        .water-percentage {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #4da6ff;
        }

        .mic-active {
          color: #4caf50;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .audio-level-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 5px;
        }

        .audio-level-fill {
          height: 100%;
          background: linear-gradient(90deg, #4caf50, #ff9800, #f44336);
          border-radius: 3px;
          transition: width 0.1s ease;
        }

        .scream-indicator {
          color: #ff4444;
          font-weight: bold;
          animation: pulse 0.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .mic-button {
          background: #4caf50;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s ease;
        }

        .mic-button:hover {
          background: #45a049;
        }

        .instructions {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 15px 25px;
          border-radius: 10px;
          text-align: center;
          z-index: 5;
        }

        .instructions p {
          margin: 5px 0;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
