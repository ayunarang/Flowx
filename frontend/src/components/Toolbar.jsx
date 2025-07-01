import { useStore } from "../store";
import { DraggableNode } from "./DraggableNode";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const PipelineToolbar = ({ onEditClick }) => {
  const canEdit = useStore((state) => state.canEdit);
  const [collapsed, setCollapsed] = useState(false);

  if (!canEdit) return null;

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <>
      <aside
        className={`
          hidden sm:flex flex-col justify-between
          ${collapsed ? "w-14" : "w-40"}
          h-full bg-white border-r shadow-md rounded-lg mt-20 ml-4 md:m-4 px-2 py-1
          transition-all duration-500 ease-in-out
          overflow-hidden
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
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
            {onEditClick && (
              <button
                onClick={onEditClick}
                className="bg-blue-600 text-white px-3 py-2 rounded w-full"
              >
                Enable Editing
              </button>
            )}
          </div>
        </div>
      </aside>

      <div
        className={`
          sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md
          flex items-center overflow-x-auto p-2 space-x-3
        `}
      >
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
            collapsed={true}
          />
        ))}
      </div>
    </>
  );
};
