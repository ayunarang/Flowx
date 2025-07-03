import { SaveIcon } from "lucide-react";
import { useStore } from "../store";
import useAuth from "../hooks/useAuth";
import { useSavePipeline } from "../hooks/useSavePipeline";
import { useParams } from "react-router-dom";

export const SavePipelineButton = ({ isDrawer, styles, onOpenChange }) => {
  const setAuthModalOpen = useStore((state) => state.setAuthModalOpen);
  const { user } = useAuth();
  const { savePipeline } = useSavePipeline();
  const canEdit = useStore((state) => state.canEdit);
  const { token: shareToken } = useParams();

  if (!canEdit) return null;

  const handleSave = (saveAsNew = false) => {
    if (!user) {
      setAuthModalOpen(true);
      isDrawer && onOpenChange(false)
      return;
    }
    savePipeline(user, saveAsNew ? { saveAsNew: true } : undefined);
    isDrawer && onOpenChange(false)
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {shareToken && (
        <div className="flex flex-row gap-2">
          <button
            onClick={() => handleSave(false)}
            className={`${isDrawer ? styles : "flex items-center gap-1 text-canvas-ink rounded text-[10px] sm:text-xs font-medium px-2 py-1 sm:px-2 sm:py-1 w-full"}`}
          >
            <SaveIcon className="h-6 sm:h-5 w-6 sm:w-5" />
            <span className={!isDrawer && "hidden md:block"}>Save</span>
          </button>

          <button
            onClick={() => handleSave(true)}
            className={`${isDrawer ? styles : "flex items-center gap-1 text-canvas-ink rounded text-[10px] sm:text-xs font-medium px-2 py-1 sm:px-2 sm:py-1 w-full whitespace-nowrap"}`}
          >
            <SaveIcon className="h-6 sm:h-5 w-6 sm:w-5" />
            <span className={!isDrawer && "hidden md:block w-fit"}>Save As New</span>
          </button>
        </div>
      )}

      {!shareToken && (
        <button
          onClick={() => handleSave(false)}
          className={`${isDrawer ? styles : "flex items-center gap-1 text-canvas-ink rounded text-[10px] sm:text-xs font-medium px-2 py-1 sm:px-2 sm:py-1 w-full"}`}
        >
          <SaveIcon className="h-6 sm:h-5 w-6 sm:w-5" />
          <span className={!isDrawer && "hidden md:block"}>Save</span>
        </button>
      )}
    </div>
  );
};
