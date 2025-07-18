export default function Score({ setCurrentPage, finalScore }) {
  const handleBackToStart = async () => {
    setCurrentPage(0); // Go back to Start component
  };

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
          <h1 className="text-[20em] font-black main-color -mt-28">
            {finalScore}
          </h1>
        </div>

        <div>
          <h1 className="text-[3.5em] font-black main-color -mt-20 uppercase">
            {finalScore === 100
              ? "perfect! amazing scream!"
              : finalScore >= 90
                ? "excellent! almost there!"
                : finalScore >= 80
                  ? "great! just little more"
                  : finalScore >= 70
                    ? "good! keep practicing"
                    : finalScore >= 60
                      ? "not bad! try again"
                      : finalScore >= 50
                        ? "okay! you can do better"
                        : "need more practice"}
          </h1>
        </div>

        <button
          onClick={handleBackToStart}
          className="text-[4em] font-black uppercase bg-[#0F61A5] text-white rounded-full px-32 py-4 mt-5"
        >
          Home
        </button>
      </div>

      <div>
        <img src="/logo-fun-bike.png" alt="indomart" className="mx-auto mt-5" />
      </div>
    </div>
  );
}
