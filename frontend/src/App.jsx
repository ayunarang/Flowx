import { PipelineToolbar } from "./components/Toolbar";
import { HeaderBar } from "./components/HeaderBar";
import { PipelineUI } from "./layouts/PipelineUI";
import { Toaster } from 'sonner';

function App() {

  return (
    <div className="relative h-screen w-screen">
      <PipelineUI />

      <div className="absolute top-0 left-0 z-10">
        <PipelineToolbar />
      </div>

      <HeaderBar />

      <Toaster richColors position="top-center" />
    </div>
  );
}

export default App;
