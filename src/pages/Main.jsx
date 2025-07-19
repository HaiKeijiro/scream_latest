import { useState } from "react";
import Start from "../components/Start";
import Scream from "../components/Scream";
import Score from "../components/Score";

export default function Main() {
  const [currentPage, setCurrentPage] = useState(0);
  const [finalScore, setFinalScore] = useState(null);

  // Debug logging for state changes
  const handlePageChange = (newPage) => {
    console.log("Page change:", currentPage, "->", typeof newPage === 'function' ? newPage(currentPage) : newPage);
    setCurrentPage(newPage);
  };

  const handleScoreChange = (score) => {
    console.log("Score set:", score);
    setFinalScore(score);
  };

  const pages = [
    <Start setCurrentPage={handlePageChange} />,
    <Scream setCurrentPage={handlePageChange} setFinalScore={handleScoreChange} />,
    <Score setCurrentPage={handlePageChange} finalScore={finalScore} />,
  ];

  // Debug current state
  console.log("Main render - currentPage:", currentPage, "finalScore:", finalScore);

  return <div className="bg-image georgia-font">{pages[currentPage]}</div>;
}
