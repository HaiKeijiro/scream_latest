export default function Start({ setCurrentPage }) {
  return (
    <main className="h-screen pt-20">
      <div className="flex flex-col px-10 justify-between">
        <div>
          <img src="/indomart.png" alt="indomart" className="mx-auto" />
        </div>
        <div className="mt-25">
          <img src="/scream.png" alt="scream" />
          <img src="/mulut.png" alt="mulut" className="mx-auto -mt-30" />
          <img src="/voice.png" alt="voice" className="mx-auto mt-30" />
        </div>
        <button
          onClick={() => setCurrentPage((prevState) => prevState + 1)}
          className="mt-25"
        >
          <img src="/start-button.png" alt="start" className="mx-auto w-[400px]" />
        </button>
      </div>
    </main>
  );
}
