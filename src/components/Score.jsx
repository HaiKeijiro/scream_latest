export default function Score({ setCurrentPage, finalScore }) {
  const handleBackToStart = async () => {
    setCurrentPage(0);
  };

  // Defensive check for finalScore
  const displayScore = finalScore !== null && finalScore !== undefined ? finalScore : 0;
  const isValidScore = typeof displayScore === 'number' && !isNaN(displayScore);

  // If we don't have a valid score, log for debugging and show 0
  if (!isValidScore) {
    console.warn("Invalid finalScore received:", finalScore);
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden py-20 flex flex-col justify-between">
      {/* Header Section */}
      <div>
        <img src="/indomart.png" alt="indomart" className="mx-auto" />
      </div>

      <div className="text-center">
        <div className="mt-20">
          <img
            src="/your-scream.png"
            alt="your-scream-score"
            className="mx-auto"
          />
        </div>

        <div>
          <h1 className="text-[20em] font-black main-color">{isValidScore ? displayScore : 0}</h1>
        </div>

        <div>
          <h1 className="text-[3.5em] font-black main-color mt-0 uppercase">
            {!isValidScore
              ? "oops! try again"
              : displayScore === 100
              ? "perfect! amazing scream!"
              : displayScore >= 90
                ? "excellent! almost there!"
                : displayScore >= 80
                  ? "great! just little more"
                  : displayScore >= 70
                    ? "good! keep practicing"
                    : displayScore >= 60
                      ? "not bad! try again"
                      : displayScore >= 50
                        ? "okay! you can do better"
                        : "need more practice"}
          </h1>
        </div>

        <button
          onClick={handleBackToStart}
          className="text-[4em] font-black uppercase bg-[#0F61A5] text-white rounded-full px-32 py-4 mt-10"
        >
          Home
        </button>
      </div>

      <div>
        <img src="/festival.png" alt="indomart" className="mx-auto" />
      </div>
    </div>
  );
}
