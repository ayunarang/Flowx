import { supabase } from '../supabaseClient';
import useAuth from '../hooks/useAuth';
import { useStore } from '../store';
import { LogIn, LogOut } from 'lucide-react';

export default function AuthButton({ isDrawer, styles }) {
  const { user } = useAuth();
  const setAuthModalOpen = useStore((state) => state.setAuthModalOpen);
  const setPipelineId = useStore((state) => state.setPipelineId);
  const setNodes = useStore((state) => state.setNodes);
  const setEdges = useStore((state) => state.setEdges);
  const setCanEdit = useStore((state) => state.setCanEdit);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setPipelineId(null);
    setNodes([]);
    setEdges([]);
    setCanEdit(true);
    window.location.href = '/';
  };

  return (
    <>
      {user ? (
        <button
          onClick={handleSignOut}
          className={`${(isDrawer) ? styles : "flex items-center gap-1 text-canvas-ink rounded text-[10px] sm:text-xs font-medium px-2 py-1 sm:px-2 sm:py-1 w-full"} `}>
          <LogOut className="h-6 sm:h-5 w-6 sm:w-5"/>
          <span className={!isDrawer && "hidden md:block w-fit whitespace-nowrap"}>
            Sign Out
          </span>
        </button>
      ) : (
        <button
          onClick={() => setAuthModalOpen(true)}
          className={`${(isDrawer) ? styles : "flex items-center gap-1 active:text-canvaPurple-active text-canvaPurple rounded text-[10px] sm:text-sm font-medium px-2 py-1 sm:px-2 sm:py-1 w-full"} `}>
          <LogIn className="hh-6 sm:h-5 w-6 sm:w-5"/>
          <span className={!isDrawer && "hidden md:block w-fit whitespace-nowrap"}>
            Sign In
          </span>
        </button>
      )}
    </>
  );
}

