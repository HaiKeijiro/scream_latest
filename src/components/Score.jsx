export default function Score({ setCurrentPage, finalScore }) {
  const handlePlayAgain = () => {
    setCurrentPage(1); // Go back to Scream component
  };

  const handleBackToStart = () => {
    setCurrentPage(0); // Go back to Start component
  };

  return (
    <div className="score-container">
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

      {/* Score Display */}
      <div className="score-content">
        <div className="game-over-title">🎮 GAME OVER</div>
        
        <div className="score-display">
          <div className="score-label">Final Score</div>
          <div className="score-value">{finalScore}%</div>
        </div>

        {finalScore === 100 ? (
          <div className="victory-message">
            🏆 CONGRATULATIONS! 🏆<br />
            You revealed the complete logo!
          </div>
        ) : (
          <div className="try-again-message">
            ⏰ Time's up!<br />
            You revealed {finalScore}% of the logo
          </div>
        )}

        <div className="score-buttons">
          <button onClick={handlePlayAgain} className="play-again-btn">
            🔄 Play Again
          </button>
          <button onClick={handleBackToStart} className="back-btn">
            🏠 Back to Start
          </button>
        </div>
      </div>

      <style jsx>{`
        .score-container {
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

        .score-content {
          position: relative;
          z-index: 2;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          color: white;
          border: 4px solid #4da6ff;
          backdrop-filter: blur(10px);
          max-width: 500px;
          min-width: 400px;
        }

        .game-over-title {
          font-size: 2.5em;
          font-weight: bold;
          margin-bottom: 30px;
          color: #ff6b6b;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .score-display {
          margin-bottom: 30px;
        }

        .score-label {
          font-size: 1.2em;
          color: #4da6ff;
          margin-bottom: 10px;
        }

        .score-value {
          font-size: 4em;
          font-weight: bold;
          color: #4caf50;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          margin-bottom: 20px;
        }

        .victory-message {
          font-size: 1.3em;
          color: #4caf50;
          margin-bottom: 30px;
          line-height: 1.5;
          font-weight: bold;
        }

        .try-again-message {
          font-size: 1.1em;
          color: #ff9800;
          margin-bottom: 30px;
          line-height: 1.5;
        }

        .score-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .play-again-btn,
        .back-btn {
          padding: 15px 25px;
          font-size: 1.1em;
          font-weight: bold;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .play-again-btn {
          background: #4caf50;
          color: white;
        }

        .play-again-btn:hover {
          background: #45a049;
          transform: translateY(-2px);
        }

        .back-btn {
          background: #6c757d;
          color: white;
        }

        .back-btn:hover {
          background: #5a6268;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
