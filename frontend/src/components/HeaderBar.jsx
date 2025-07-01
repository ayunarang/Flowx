import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useStore } from "../store";
import AuthButton from "./AuthButton";
import DownloadButton from "./DownloadButton";
import { SavePipelineButton } from "./SavePipelineButton";
import ShareButton from "./ShareButton";
import MoreOptionsDrawer from "./MoreOptionsDrawer";
import DownloadDrawer from "./DownloadDrawer";
import AuthModal from "../layouts/AuthModal";
import { MoreVerticalIcon } from "lucide-react";

export const HeaderBar = ({ reactFlowWrapper }) => {
    const { user } = useAuth();
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    const currentPipelineName = useStore((state) => state.currentPipelineName);
    const setCurrentPipelineName = useStore((state) => state.setCurrentPipelineName);
    const isAutoSaved = useStore((state) => state.isAutoSaved);
    const canEdit = useStore((state) => state.canEdit);

    const getInitial = () => {
        if (user?.email) return user.email.charAt(0).toUpperCase();
        return "?";
    };

    return (
        <div className=" fixed top-4 
  left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 z-30 flex justify-between md:w-fit w-auto items-center bg-white sm:px-5 px-3 py-2 rounded-md shadow-md gap-3  ">
            {/* LEFT side */}
            <div className="flex items-center gap-2">
                {canEdit && (
                    <>
                        <p className={`text-xs font-medium ${isAutoSaved ? "text-blue-600" : "text-gray-400"}`}>
                            {isAutoSaved ? "Saved" : "Idle"}
                        </p>

                        <input
                            type="text"
                            value={currentPipelineName}
                            onChange={(e) => setCurrentPipelineName(e.target.value)}
                            placeholder="Pipeline name"
                            className="font-semibold px-2 py-1 border-b border-gray-400 focus:outline-none bg-transparent text-sm min-w-20 max-w-full"
                        />
                    </>
                )}
            </div>

            <div className="flex items-center gap-2">
                {canEdit && (
                    <>

                        <SavePipelineButton />
                        <ShareButton />
                        <DownloadButton flowRef={reactFlowWrapper} />
                    </>
                )}

                <div className="hidden md:block">
                    <AuthButton />
                </div>

                {user && (
                    <div className="flex relative items-center gap-2">
                        <div className="group relative">
                            <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700 cursor-default">
                                {getInitial()}
                            </div>
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition">
                                {user.email}
                            </div>
                        </div>
                    </div>
                )}
                                       
                        <button
                            onClick={() => setIsMoreOpen(true)}
                            className="block md:hidden"
                        >
                            <MoreVerticalIcon className="w-5 h-5" />
                        </button>
            </div>

            <MoreOptionsDrawer
                open={isMoreOpen}
                onOpenChange={setIsMoreOpen}
                isSignedIn={!!user}
                onDownloadClick={() => {
                    setIsMoreOpen(false);
                    setIsDownloadOpen(true);
                }}
                onAuthClick={() => {
                    setIsMoreOpen(false);
                    setIsAuthOpen(true);
                }}
            />
            <DownloadDrawer
                open={isDownloadOpen}
                onOpenChange={setIsDownloadOpen}
                flowRef={reactFlowWrapper}
            />
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
            />
        </div>
    );
};
