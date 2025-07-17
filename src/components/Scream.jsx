import { useState, useEffect, useRef } from "react";

export default function Scream({ setCurrentPage, setFinalScore }) {
  const [waterLevel, setWaterLevel] = useState(0); // Water level percentage (0-100)
  const [isScreaming, setIsScreaming] = useState(false);
  const [microphoneActive, setMicrophoneActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [gameTimer, setGameTimer] = useState(30); // Game timer in seconds
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const gameTimerRef = useRef(null);

  // Reset game state when component mounts (for play again functionality)
  useEffect(() => {
    setWaterLevel(0);
    setGameTimer(30);
    setGameStarted(false);
    setGameEnded(false);
    setIsScreaming(false);
    setAudioLevel(0);
  }, []);

  // Microphone setup and audio analysis
  useEffect(() => {
    let mounted = true;

    const setupMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (!mounted) return;

        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
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
          const average =
            dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          const normalizedLevel = average / 255;

          setAudioLevel(normalizedLevel);

          // Determine if screaming (threshold-based detection)
          const screamThreshold = 0.3; // Adjust this value for sensitivity
          setIsScreaming(normalizedLevel > screamThreshold);

          animationFrameRef.current = requestAnimationFrame(analyzeAudio);
        };

        analyzeAudio();
      } catch (error) {
        console.error("Error accessing microphone:", error);
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

  // Game timer logic
  useEffect(() => {
    if (microphoneActive && !gameStarted && !gameEnded) {
      setGameStarted(true);
    }

    if (gameStarted && !gameEnded) {
      gameTimerRef.current = setInterval(() => {
        setGameTimer((prevTimer) => {
          if (prevTimer <= 1) {
            // Timer expired - game over
            setGameEnded(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000); // Update every second
    }

    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, [gameStarted, gameEnded, microphoneActive]);

  // Game over conditions and final score handling
  useEffect(() => {
    if (gameEnded || waterLevel >= 100) {
      if (!gameEnded) {
        setGameEnded(true);
      }
      
      // Capture final score and navigate to score page
      const finalScore = Math.round(waterLevel);
      setFinalScore(finalScore);
      
      // Add a small delay for better UX
      setTimeout(() => {
        setCurrentPage(2); // Navigate to Score component
      }, 1000);
    }
  }, [gameEnded, waterLevel, setCurrentPage, setFinalScore]);

  // Logo reveal level mechanics (same as water level)
  useEffect(() => {
    if (gameEnded) return; // Stop water level changes when game is over

    const interval = setInterval(() => {
      setWaterLevel((currentLevel) => {
        if (isScreaming) {
          // Reveal logo quickly when screaming (responsive refill)
          return Math.min(100, currentLevel + 2.5);
        } else {
          // Slow drip when not screaming (natural leak)
          return Math.max(0, currentLevel - 0.3);
        }
      });
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [isScreaming, gameEnded]);

  const requestMicrophoneAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      window.location.reload(); // Refresh to restart with microphone access
    } catch (error) {
      alert(
        "Microphone access is required for the logo reveal mechanic to work!"
      );
    }
  };

  return (
    <div className="scream-container">
      {/* Background */}
      <div
        className="background"
        style={{
          backgroundImage: "url(/bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Logo Reveal Container */}
      <div className="logo-reveal-container">
        {/* Revealed portion of logo - grows from bottom up */}
        <div
          className="logo-revealed"
          style={{
            height: `${waterLevel}%`, // Reveal from bottom up
          }}
        >
          <div className="logo-fixed">
            <img src="/festival.png" alt="Logo" className="logo-image" />
          </div>
        </div>

        {/* Ripples effect when screaming */}
        {isScreaming && (
          <div className="logo-ripples">
            <div className="ripple ripple-1"></div>
            <div className="ripple ripple-2"></div>
            <div className="ripple ripple-3"></div>
          </div>
        )}
      </div>

      {/* Status indicators */}
      <div className="status-panel">
        <div className="timer-display">
          <div className="timer-label">⏰ Time Remaining</div>
          <div className={`timer-value ${gameTimer <= 10 ? 'timer-critical' : ''}`}>
            {Math.floor(gameTimer / 60)}:{(gameTimer % 60).toString().padStart(2, '0')}
          </div>
        </div>
        
        <div className="reveal-percentage">
          Logo Revealed: {Math.round(waterLevel)}%
        </div>

        {gameEnded && (
          <div className="game-over-indicator">
            🎮 GAME OVER
          </div>
        )}

        {microphoneActive ? (
          <div className="audio-indicator">
            <div className="mic-active">🎤 Listening...</div>
            <div className="audio-level-bar">
              <div
                className="audio-level-fill"
                style={{ width: `${audioLevel * 100}%` }}
              />
            </div>
            {isScreaming && (
              <div className="scream-indicator">🔊 SCREAMING!</div>
            )}
          </div>
        ) : (
          <button onClick={requestMicrophoneAccess} className="mic-button">
            Enable Microphone
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="instructions">
        <p>🗣️ Scream to reveal the logo!</p>
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

        .logo-reveal-container {
          position: relative;
          width: 837px;
          height: 520px;
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

        .logo-revealed {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          transition: height 0.1s ease-out;
          z-index: 3;
        }

        .logo-fixed {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 4;
        }

        .logo-image {
          width: 837px !important;
          height: 520px !important;
          max-width: none !important;
          object-fit: cover;
          transition: all 0.3s ease;
          display: block;
        }

        .logo-ripples {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 5;
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

        .timer-display {
          margin-bottom: 15px;
          text-align: center;
        }

        .timer-label {
          font-size: 14px;
          color: #4da6ff;
          margin-bottom: 5px;
        }

        .timer-value {
          font-size: 24px;
          font-weight: bold;
          color: #4caf50;
          transition: color 0.3s ease;
        }

        .timer-critical {
          color: #ff4444 !important;
          animation: pulse-timer 1s infinite;
        }

        @keyframes pulse-timer {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }

        .reveal-percentage {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #4da6ff;
        }

        .game-over-indicator {
          background: rgba(255, 68, 68, 0.9);
          color: white;
          padding: 10px;
          border-radius: 8px;
          text-align: center;
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 10px;
          animation: pulse 1s infinite;
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
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
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
