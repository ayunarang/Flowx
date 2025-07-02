import useAuth from '../hooks/useAuth';
import { useStore } from '../store';
import { useSavePipeline } from '../hooks/useSavePipeline';
import { Share2Icon } from 'lucide-react'

export default function ShareButton({ isDrawer, styles }) {
  const setAuthModalOpen = useStore((state) => state.setAuthModalOpen);
  const setShareModalOpen = useStore((state) => state.setShareModalOpen);
  const canEdit = useStore((state) => state.canEdit);

  const { user } = useAuth();
  const { savePipeline } = useSavePipeline();

  if (!canEdit) return null;


  const handleShare = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    await savePipeline(user);
    setShareModalOpen(true);
  };

  return (
    <button
      onClick={handleShare}
      className={`${(isDrawer) ? styles : "flex items-center gap-1  text-canvas-ink rounded text-[10px] sm:text-xs font-medium px-2 py-1 sm:px-2 sm:py-1"} `}>
      <Share2Icon className="h-6 sm:h-5 w-6 sm:w-5"/>
      <span className={!isDrawer && "hidden md:block"}>
        Share
      </span>
    </button>
  );
}

