import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import BatchPage from "./page/BatchPage";
import HomePage from "./page/HomePage";

function App() {
  return (
    <BrowserRouter>
      <nav className="p-2 bg-[#2f3130] flex space-x-1">
        <Link
          to="/"
          className="py-1 px-3 rounded-lg hover:bg-[#8fa791] text-white"
        >
          單次上傳
        </Link>
        <Link
          to="/batch"
          className="py-1 px-3 rounded-lg hover:bg-[#8fa791] text-white"
        >
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
