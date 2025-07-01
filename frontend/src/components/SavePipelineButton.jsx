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
    <div className="flex justify-center align-middle">
      <button
        type="button"
        onClick={handleSave}
        className="bg-[#1e1e28] text-white text-base font-medium px-3 py-2 rounded-md w-full shadow-subtle active:bg-[#292933] z-10"
      >
        {shareToken ? "Save As New" : "Save"}
      </button>
    </div>
  );
};
