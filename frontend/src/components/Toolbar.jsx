import { useStore } from "../store";
import { DraggableNode } from "./DraggableNode";
import { useState } from "react";
import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
import { useSavePipeline } from "../hooks/useSavePipeline";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const PipelineToolbar = () => {
  const canEdit = useStore((state) => state.canEdit);
  const [collapsed, setCollapsed] = useState(false);
  const setNodes = useStore((state) => state.setNodes)
  const setEdges = useStore((state) => state.setEdges)
  const { savePipeline } = useSavePipeline();
  const user = useAuth()
  const navigate = useNavigate()

  if (!canEdit) return null;

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleNewPipeline = () => {
    savePipeline(user, { showToast: false });
    setNodes([])
    setEdges([])
    navigate("/")
  }

  return (
    <>
      <aside
        className={`
          hidden md:flex flex-col justify-between bg-[#faf7ff]
          ${collapsed ? "w-14" : "w-40"}
          h-full  border-r shadow-md rounded-lg mt-20 ml-4 md:m-4 px-2 py-1 transition-all duration-500 ease-in-out overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start">
            <div
              className={`
                flex flex-col transition-all duration-500 ease-in-out
                ${collapsed ? "opacity-0  hidden" : "opacity-100"}
              `}
            >
              <h3 className="text-sm font-bold">Nodes Library</h3>
              <p className="text-[9px] text-black font-medium">Drag and Drop</p>
              <hr className="border border-gray-200 mb-1 mt-2" />
            </div>
            <button
              onClick={toggleCollapsed}
              className="p-1 text-gray-600 hover:text-gray-900"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          <button
            className=" text-canvaPurple px-3 py-1.5 rounded max-w-fit sm:w-auto md:flex gap-1 items-center text-xs mb-2 mt-1 hidden font-semibold bg-[#f0ecfc] hover:bg-[#ede8fb] active:bg-[#ede8fb] transition-all ease-in-out"
            onClick={handleNewPipeline}
          >
            <span className="">New Pipeline</span>
            <PlusIcon height={14} width={14} className="font-bold" />
          </button>

          <div className="flex flex-col gap-3 transition-all duration-500 ease-in-out">
            {[
              ["customInput", "Input"],
              ["llm", "LLM"],
              ["customOutput", "Output"],
              ["text", "Text"],
              ["ifElse", "Condition"],
              ["operation", "Math Operation"],
              ["constant", "Constant"],
              ["api", "API"],
              ["auth", "Auth"],
            ].map(([type, label]) => (
              <DraggableNode
                key={type}
                type={type}
                label={label}
                collapsed={collapsed}
              />
            ))}
          </div>

          <div
            className={`
              mt-auto pt-2 transition-all duration-500 ease-in-out
              ${collapsed ? "opacity-0 translate-y-[-10px] pointer-events-none" : "opacity-100 translate-y-0"}
            `}
          >
          </div>
        </div>
      </aside>

      <div
        className={`
          md:hidden fixed bottom-0 left-0 right-0 bg-[#faf7ff] border-t shadow-md
          flex items-center overflow-x-auto px-2 py-1.5`}
      >
        {[
          ["customInput", "Input"],
          ["llm", "LLM"],
          ["customOutput", "Output"],
          ["text", "Text"],
          ["ifElse", "Condition"],
          ["operation", "Math"],
          ["constant", "Constant"],
          ["api", "API"],
          ["auth", "Auth"],
        ].map(([type, label]) => (
          <DraggableNode
            key={type}
            type={type}
            label={label}
            collapsed={true}
          />
        ))}
      </div>
    </>
  );
};
