import { useNavigate } from 'react-router-dom';
import { LayoutDashboardIcon } from 'lucide-react';

export default function DashboardButton({ isDrawer, styles }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <button
      onClick={handleNavigate}
      className={`${(isDrawer) ? styles : "flex items-center gap-1  text-canvas-ink rounded text-[10px] sm:text-xs font-medium px-2 py-1 sm:px-2 sm:py-1"} `}
    >
      <LayoutDashboardIcon className="h-8 sm:h-5 w-8 sm:w-5" /> 
      <span className={!isDrawer && "hidden md:block"}>
        Dashboard
      </span>
    </button>
  );
}
