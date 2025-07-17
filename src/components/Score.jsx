export default function Score({ setCurrentPage, finalScore }) {

  const handleBackToStart = () => {
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
          <h1 className="text-[20em] font-black main-color">
            {finalScore}
          </h1>
        </div>

        <button onClick={handleBackToStart}>
          <h1 className="text-[4em] font-black main-color mt-10 uppercase">
            {finalScore === 100
              ? "excellent!"
              : finalScore >= 80
                ? "great! just little more"
                : "need more practice"}
          </h1>
        </button>
      </div>

      <div>
        <img src="/festival.png" alt="indomart" className="mx-auto" />
      </div>
    </div>
  );
}
