import useAuth from "../hooks/useAuth";
import { useStore } from "../store";
import AuthButton from "./AuthButton";
import DownloadButton from "./DownloadButton";
import { SavePipelineButton } from "./SavePipelineButton";
import ShareButton from "./ShareButton";

export const HeaderBar = ({ reactFlowWrapper }) => {
    const { user } = useAuth();
    const currentPipelineName = useStore((state) => state.currentPipelineName);
    const setCurrentPipelineName = useStore((state) => state.setCurrentPipelineName);
    const isAutoSaved = useStore((state) => state.isAutoSaved);
    const canEdit = useStore((state) => state.canEdit);



    const getInitial = () => {
        if (user?.email) return user.email.charAt(0).toUpperCase();
        return "?";
    };

    return (
        <div className="absolute top-4 right-14 z-20 flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-md">
            {user && (
                <>
                    {canEdit &&
                        <>
                            <p className={`ml-2 text-sm font-medium ${isAutoSaved ? "text-blue-600" : "text-gray-400"}`}>
                                {isAutoSaved ? "Auto-saved" : "Idle"}
                            </p>

                            <input
                                type="text"
                                value={currentPipelineName}
                                onChange={(e) => setCurrentPipelineName(e.target.value)}
                                placeholder="Pipeline name"
                                className="font-semibold px-2 py-1 border-b border-gray-400 focus:outline-none focus:border-blue-600 bg-transparent"
                            />
                        </>}

                    <button className="px-4 py-1 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700">
                        Dashboard
                    </button>
                </>
            )}

            {canEdit && <SavePipelineButton />}
            {canEdit && <ShareButton />}
            <DownloadButton flowRef={reactFlowWrapper} />

            {user && (
                <div className="relative flex items-center gap-2">
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

            <AuthButton />
        </div>
    );
};
