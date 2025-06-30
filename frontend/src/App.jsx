import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PipelineToolbar } from "./components/Toolbar";
import { HeaderBar } from "./components/HeaderBar";
import { PipelineUI } from "./layouts/PipelineUI";
import { Toaster } from 'sonner';
import SharePage from "./layouts/SharePage"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="relative h-screen w-screen">
            <PipelineUI />

            <div className="absolute top-0 left-0 z-10">
              <PipelineToolbar />
            </div>

            <HeaderBar />

            <Toaster richColors position="top-center" />
          </div>
        } />
        
        <Route path="/share/:token" element={<SharePage />} />
      </Routes>
    </Router>
  );
}

export default App;
