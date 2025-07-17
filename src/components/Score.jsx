export default function Score({ setCurrentPage, finalScore }) {
  const handlePlayAgain = () => {
    setCurrentPage(1); // Go back to Scream component
  };

  const handleBackToStart = () => {
    setCurrentPage(0); // Go back to Start component
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div
        className="absolute top-0 left-0 w-full h-full z-[1]"
        style={{
          backgroundImage: "url(/bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Score Display */}
      <div className="relative z-[2] bg-black/80 rounded-[20px] p-10 text-center text-white border-4 border-blue-400 backdrop-blur-[10px] max-w-[500px] min-w-[400px]">
        <div className="text-[2.5em] font-bold mb-[30px] text-red-400 [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">🎮 GAME OVER</div>
        
        <div className="mb-[30px]">
          <div className="text-xl text-blue-400 mb-2.5">Final Score</div>
          <div className="text-[4em] font-bold text-green-400 [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)] mb-5">{finalScore}%</div>
        </div>

        {finalScore === 100 ? (
          <div className="text-[1.3em] text-green-400 mb-[30px] leading-[1.5] font-bold">
            🏆 CONGRATULATIONS! 🏆<br />
            You revealed the complete logo!
          </div>
        ) : (
          <div className="text-[1.1em] text-orange-400 mb-[30px] leading-[1.5]">
            ⏰ Time's up!<br />
            You revealed {finalScore}% of the logo
          </div>
        )}

        <div className="flex gap-5 justify-center flex-wrap">
          <button 
            onClick={handlePlayAgain} 
            className="py-[15px] px-[25px] text-[1.1em] font-bold border-none rounded-[10px] cursor-pointer transition-all duration-300 ease-in-out uppercase bg-green-400 text-white hover:bg-green-500 hover:-translate-y-0.5"
          >
            🔄 Play Again
          </button>
          <button 
            onClick={handleBackToStart} 
            className="py-[15px] px-[25px] text-[1.1em] font-bold border-none rounded-[10px] cursor-pointer transition-all duration-300 ease-in-out uppercase bg-gray-600 text-white hover:bg-gray-700 hover:-translate-y-0.5"
          >
            🏠 Back to Start
          </button>
        </div>
      </div>
    </div>
  );
}
