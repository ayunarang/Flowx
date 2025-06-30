import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PipelineToolbar } from "./components/Toolbar";
import { HeaderBar } from "./components/HeaderBar";
import { PipelineUI } from "./layouts/PipelineUI";
import { Toaster } from 'sonner';
import SharePage from "./layouts/SharePage"; 
import { useRef } from "react";

function App() {
    const reactFlowWrapper = useRef(null);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="relative h-screen w-screen">
            <PipelineUI reactFlowWrapper={reactFlowWrapper}/>

            <div className="absolute top-0 left-0 z-10">
              <PipelineToolbar />
            </div>

            <HeaderBar reactFlowWrapper={reactFlowWrapper}/>

            <Toaster richColors position="top-center" />
          </div>
        } />
        
        <Route path="/share/:token" element={<SharePage />} />
      </Routes>
    </Router>
  );
}

export default App;
