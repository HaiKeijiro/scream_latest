import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />,
      <Route path="/database" element={<Database />} />,
    </Routes>
  );
}

export default App;
