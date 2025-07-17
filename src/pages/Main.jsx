import { useState } from "react";
import Start from "../components/Start";
import Register from "../components/Register";
import Scream from "../components/Scream";
import Score from "../components/Score";

export default function Main() {
  const [currentPage, setCurrentPage] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    phone: ""
  });

  const pages = [
    <Start setCurrentPage={setCurrentPage} />,
    <Register 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage} 
      userData={userData}
      setUserData={setUserData}
    />,
    <Scream setCurrentPage={setCurrentPage} setFinalScore={setFinalScore} />,
    <Score 
      setCurrentPage={setCurrentPage} 
      finalScore={finalScore} 
      userData={userData}
      setUserData={setUserData}
    />,
  ];

  return <div className="bg-image georgia-font">{pages[currentPage]}</div>;
}
