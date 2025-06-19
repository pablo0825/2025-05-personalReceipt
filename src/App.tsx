import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import BatchPage from "./page/BatchPage";
import HomePage from "./page/HomePage";

function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-gray-100 flex space-x-4">
        <Link to="/single" className=" hover:text-[#8fa791]">
          單次上傳
        </Link>
        <Link to="/batch" className=" hover:text-[#8fa791]">
          批次上傳
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/batch" element={<BatchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
