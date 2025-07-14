import { useState } from "react";
import Start from "../components/Start";
import Register from "../components/Register";
import Scream from "../components/Scream";
import Score from "../components/Score";

export default function Main() {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    <Start setCurrentPage={setCurrentPage} />,
    <Register currentPage={currentPage} setCurrentPage={setCurrentPage} />,
    <Scream setCurrentPage={setCurrentPage} />,
    <Score setCurrentPage={setCurrentPage} />,
  ];

  return <div>{pages[currentPage]}</div>;
}
