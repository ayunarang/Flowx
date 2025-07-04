import { useState } from "react";
import useAuth from "../hooks/useAuth";
import AuthButton from "./AuthButton";
import DownloadButton from "./DownloadButton";
import { SavePipelineButton } from "./SavePipelineButton";
import ShareButton from "./ShareButton";
import MoreOptionsDrawer from "./MoreOptionsDrawer";
import DownloadDrawer from "./DownloadDrawer";
import { MoreVerticalIcon } from "lucide-react";
import PipelineNameInput from "./PipelineNameInput";
import DashboardButton from "./DashboardButton";
import UndoRedoButtons from "./UndoRedo";
import ResetButton from "./ResetButton";

export const HeaderBar = ({ reactFlowWrapper }) => {
  const { user } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const getInitial = () => {
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "?";
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 z-30 flex justify-between md:w-fit w-auto items-center bg-[#faf7ff] sm:px-5 px-3 py-2 rounded-md shadow-md gap-2 align-middle">

      {user &&
        <PipelineNameInput />
      }


      <ResetButton />

      <UndoRedoButtons />

      <div className="flex items-center">
        <SavePipelineButton />
        <ShareButton />
        <DownloadButton flowRef={reactFlowWrapper} />

        {user &&
          <div className="hidden md:block">
            <DashboardButton />
          </div>}


        <div className="hidden md:block">
          <AuthButton />
        </div>

        {user && (
          <div className="flex relative items-center mx-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-canvas-sky flex items-center justify-center font-bold text-canvaPurple cursor-pointer peer">
                {getInitial()}
              </div>
              <div className="absolute mt-3 right-0 px-3 py-2 bg-canvas-sky text-canvas-charcoal sm:text-sm text-xs rounded opacity-0 sm:font-medium peer-hover:opacity-100 transition">
                {user.email}
                <span
                  className="absolute"
                  style={{
                    bottom: "100%",
                    right: "0.75rem",
                    width: 0,
                    height: 0,
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderBottom: "8px solid #afcbff",
                  }}
                ></span>
              </div>
            </div>
          </div>

        )}

        <button
          onClick={() => setIsMoreOpen(true)}
          className="block md:hidden"
        >
          <MoreVerticalIcon className="h-6 sm:h-5 w-6 sm:w-5 text-canvas-ink" />
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

