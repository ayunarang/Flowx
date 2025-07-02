import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useStore } from "../store";
import AuthButton from "./AuthButton";
import DownloadButton from "./DownloadButton";
import { SavePipelineButton } from "./SavePipelineButton";
import ShareButton from "./ShareButton";
import MoreOptionsDrawer from "./MoreOptionsDrawer";
import DownloadDrawer from "./DownloadDrawer";
import { MoreVerticalIcon } from "lucide-react";
import PipelineNameInput from "./PipelineNameInput";
import DashboardButton from "./DashboardButton";

export const HeaderBar = ({ reactFlowWrapper }) => {
  const { user } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const getInitial = () => {
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "?";
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 z-30 flex justify-between md:w-fit w-auto items-center bg-white sm:px-5 px-3 py-2 rounded-md shadow-md gap-2 align-middle">
      
      <div className="hidden sm:flex">
        <PipelineNameInput />
      </div>

      <div className="flex items-center gap-2 sm:gap-1">
        <SavePipelineButton />
        <ShareButton />
        <DownloadButton flowRef={reactFlowWrapper} />

        <div className="hidden md:block">
          <DashboardButton />
        </div>

        <div className="hidden md:block">
          <AuthButton />
        </div>

        {user && (
          <div className="flex relative items-center gap-2 ml-2">
            <div className="group relative">
              <div className="sm:w-8 sm:h-8 w-10 h-10 rounded-full bg-canvas-sky flex items-center justify-center font-bold text-canvaPurple cursor-default">
                {getInitial()}
              </div>
              <div className="absolute top-14 right-0 px-2 py-1 bg-canvas-sky text-canvas-charcoal text-sm rounded opacity-0 group-hover:opacity-100 transition">
                {user.email}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsMoreOpen(true)}
          className="block md:hidden"
        >
          <MoreVerticalIcon className="w-8 h-8 text-canvas-ink" />
        </button>
      </div>

      <MoreOptionsDrawer
        open={isMoreOpen}
        onOpenChange={setIsMoreOpen}
        isSignedIn={!!user}
        flowRef={reactFlowWrapper}
      />

      <DownloadDrawer
        open={isDownloadOpen}
        onOpenChange={setIsDownloadOpen}
        flowRef={reactFlowWrapper}
      />
    </div>
  );
};

