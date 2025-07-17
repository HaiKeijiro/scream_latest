export default function Score({ setCurrentPage, finalScore, userData, setUserData }) {
  const saveUserData = async () => {
    const completeUserData = {
      name: userData.name.trim(),
      phone: userData.phone.trim(),
      score: finalScore
    };

    try {
      const response = await fetch("http://localhost:3002/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeUserData),
      });

      if (response.ok) {
        console.log("User data saved successfully");
        return true;
      } else {
        console.error("Failed to save user data");
        return false;
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      return false;
    }
  };

  const handleBackToStart = async () => {
    // Save user data with score before going back to start
    const success = await saveUserData();
    
    // Reset user data for next player
    setUserData({
      name: "",
      phone: ""
    });
    
    if (success) {
      setCurrentPage(0); // Go back to Start component
    } else {
      // Still go back even if save failed, but could show an error message
      alert("There was an issue saving your data, but you can still play again!");
      setCurrentPage(0);
    }
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
