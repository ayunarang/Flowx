import { DraggableNode } from "./DraggableNode";
import { SubmitButton } from "./Submit";

export const PipelineToolbar = () => {
  return (
    <aside className="w-44 h-full p-3 bg-white border-r shadow-md rounded-lg m-4 flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold">Nodes Library</h3>
        <p className="text-xs text-black font-medium">Drag and Drop</p>
        <hr className="border border-gray-200 mb-4 mt-2"></hr>
        <div className="flex flex-col gap-3">
          <DraggableNode type="customInput" label="Input" />
          <DraggableNode type="llm" label="LLM" />
          <DraggableNode type="customOutput" label="Output" />
          <DraggableNode type="text" label="Text" />
          <DraggableNode type="ifElse" label="Condition" />
          <DraggableNode type="operation" label="Math Operation" />
          <DraggableNode type="constant" label="Constant" />
          <DraggableNode type="api" label="API" />
          <DraggableNode type="auth" label="Auth" />
          <SubmitButton />
        </div>
      </div>
    </aside>
  );
};
