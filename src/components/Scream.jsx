import { useState, useEffect, useRef } from "react";

export default function Scream({ setCurrentPage, setFinalScore }) {
  // Game state
  const [waterLevel, setWaterLevel] = useState(0); // Water level percentage (0-100)
  const [isScreaming, setIsScreaming] = useState(false);
  const [microphoneActive, setMicrophoneActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [gameTimer, setGameTimer] = useState(5); // Game timer in seconds
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  // Audio refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const gameTimerRef = useRef(null);
  const waterLevelIntervalRef = useRef(null);

  // Reset game state when component mounts (for play again functionality)
  useEffect(() => {
    setWaterLevel(0);
    setGameTimer(5);
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
        
        // Resume audio context if suspended (fixes idle time issue)
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
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
          if (!mounted || !audioContextRef.current) return;

          // Check if audio context is still active
          if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(console.error);
          }

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
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
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

  // Centralized game end handler to prevent race conditions
  const endGame = useRef(false);
  useEffect(() => {
    if (gameEnded && !endGame.current) {
      endGame.current = true;
      
      // Clear all intervals immediately
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
        gameTimerRef.current = null;
      }
      if (waterLevelIntervalRef.current) {
        clearInterval(waterLevelIntervalRef.current);
        waterLevelIntervalRef.current = null;
      }
      
      // Capture final score and navigate to score page
      const finalScore = Math.round(waterLevel);
      setFinalScore(finalScore);
      
      console.log("Game ended with score:", finalScore); // Debug log

      // Add a small delay for better UX
      setTimeout(() => {
        if (endGame.current) { // Double-check to prevent multiple navigations
          setCurrentPage((prevState) => prevState + 1); // Navigate to Score component
        }
      }, 1000);
    }
  }, [gameEnded, waterLevel, setCurrentPage, setFinalScore]);

  // Logo reveal level mechanics (same as water level)
  useEffect(() => {
    if (gameEnded) return; // Stop water level changes when game is over

    waterLevelIntervalRef.current = setInterval(() => {
      setWaterLevel((currentLevel) => {
        if (isScreaming) {
          // Reveal logo quickly when screaming (responsive refill)
          const newLevel = Math.min(100, currentLevel + 2.5);
          
          // If we've reached 100%, immediately end the game
          if (newLevel >= 100 && !gameEnded && !endGame.current) {
            setGameEnded(true);
          }
          
          return newLevel;
        } else {
          // Slow drip when not screaming (natural leak)
          return Math.max(0, currentLevel - 0.3);
        }
      });
    }, 50); // Update every 50ms for smooth animation

    return () => {
      if (waterLevelIntervalRef.current) {
        clearInterval(waterLevelIntervalRef.current);
      }
    };
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
    <div className="relative w-screen h-screen overflow-hidden pt-20">
      {/* Header Section */}
      <div>
        <img src="/indomart.png" alt="indomart" className="mx-auto" />
      </div>

      {/* Timer Section */}
      <div className="main-color mt-30 text-[5em] text-center">
        <div>
          <img src="/keep.png" alt="keep" className="mx-auto" />
        </div>
        <h1 className="font-black text-[1.5em]">{gameTimer}</h1>
      </div>

      {/* Logo Reveal Container */}
      <div className="relative w-[837px] h-[520px] rounded-[20px] overflow-hidden z-[2] flex items-center justify-center mx-auto mt-20">
        {/* Revealed portion of logo - grows from bottom up */}
        <div
          className="absolute bottom-0 left-0 w-full overflow-hidden transition-[height] duration-100 ease-out z-[3]"
          style={{
            height: `${waterLevel}%`, // Reveal from bottom up
          }}
        >
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-[4]">
            <img
              src="/festival.png"
              alt="Logo"
              className="block w-[837px] h-[520px] max-w-none object-cover transition-all duration-300 ease-in-out"
            />
          </div>
        </div>

        {/* Ripples effect when screaming */}
        {isScreaming && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[5]">
            <div className="absolute top-[20%] left-[30%] w-10 h-10 border-2 border-white/60 rounded-full animate-[ripple-animation_1s_infinite]"></div>
            <div className="absolute top-[60%] left-[60%] w-[30px] h-[30px] border-2 border-white/60 rounded-full animate-[ripple-animation_1s_infinite] delay-300"></div>
            <div className="absolute top-[40%] left-[10%] w-[35px] h-[35px] border-2 border-white/60 rounded-full animate-[ripple-animation_1s_infinite] delay-[600ms]"></div>
          </div>
        )}
      </div>

      {/* Status indicators - Unhide for testing */}
      {/* 
      <div className="absolute top-5 right-5 bg-black/70 text-white p-[15px] rounded-[10px] z-[5] min-w-[200px]">
        <div className="mb-[15px] text-center">
          <div className="text-sm text-blue-400 mb-[5px]">
            ⏰ Time Remaining
          </div>
          <div
            className={`text-2xl font-bold transition-colors duration-300 ease-in-out ${
              gameTimer <= 10 
                ? "text-red-400 animate-[pulse-timer_1s_infinite]" 
                : "text-green-400"
            }`}
          >
            {Math.floor(gameTimer / 60)}:
            {(gameTimer % 60).toString().padStart(2, "0")}
          </div>
        </div>
        
        <div className="text-lg font-bold mb-2.5 text-blue-400">
          Logo Revealed: {Math.round(waterLevel)}%
        </div>

        {gameEnded && (
          <div className="bg-red-400/90 text-white p-2.5 rounded-lg text-center font-bold text-base mb-2.5 animate-pulse">
            🎮 GAME OVER
          </div>
        )}

        {microphoneActive ? (
          <div>
            <div className="text-green-400 text-sm mb-[5px]">
              🎤 Listening...
            </div>
            <div className="w-full h-[6px] bg-white/30 rounded-[3px] overflow-hidden mb-[5px]">
              <div
                className="h-full bg-gradient-to-r from-green-400 via-orange-400 to-red-500 rounded-[3px] transition-[width] duration-100 ease-in-out"
                style={{ width: `${audioLevel * 100}%` }}
              />
            </div>
            {isScreaming && (
              <div className="text-red-400 font-bold animate-pulse">
                🔊 SCREAMING!
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={requestMicrophoneAccess} 
            className="bg-green-400 text-white border-none py-2.5 px-[15px] rounded-[5px] cursor-pointer text-sm transition-colors duration-300 ease-in-out hover:bg-green-500"
          >
            Enable Microphone
          </button>
        )}
      </div> 
      */}
    </div>
  );
}
