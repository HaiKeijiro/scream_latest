import { useState } from "react";

export default function Main() {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    <Start setCurrentPage={setCurrentPage} />,
    <Register currentPage={currentPage} setCurrentPage={setCurrentPage} />,
  ];

  return <div>{pages[currentPage]}</div>;
}
