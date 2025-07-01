import { SaveIcon } from "lucide-react";
import { useStore } from "../store";
import useAuth from "../hooks/useAuth";
import { useSavePipeline } from "../hooks/useSavePipeline";

export const SavePipelineButton = ({ shareToken }) => {
  const setAuthModalOpen = useStore((state) => state.setAuthModalOpen);
  const { user } = useAuth();
  const { savePipeline } = useSavePipeline();
  const canEdit = useStore((state) => state.canEdit);

  if (!canEdit) return null;

  const handleSave = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (shareToken) {
      savePipeline(user, { saveAsNew: true });
    } else {
      savePipeline(user);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <button
        type="button"
        onClick={handleSave}
        className="
          flex items-center justify-center gap-1
          bg-[#1e1e28] text-white
          text-[10px] sm:text-sm font-medium
          px-2 py-1 sm:px-2 sm:py-1
          rounded-md shadow-subtle active:bg-[#292933] z-10
        "
      >
        <SaveIcon height={14} width={14}/>
          <span className="hidden md:inline ml-1">
            {shareToken ? "Save As New" : "Save"}
          </span>
      </button>
    </div>
  );
};
