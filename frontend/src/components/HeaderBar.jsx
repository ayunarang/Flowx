import useAuth from "../hooks/useAuth";
import AuthButton from "./AuthButton";
import DownloadButton from "./DownloadButton";
import { SavePipelineButton } from "./SavePipelineButton";
import ShareButton from "./ShareButton";

export const HeaderBar = ({ reactFlowWrapper }) => {
    const { user } = useAuth();

    const getInitial = () => {
        if (user?.email) return user.email.charAt(0).toUpperCase();
        return "?";
    };

    return (
        <div className="absolute top-4 right-14 z-20 flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-md">
            {
                user && <button className="px-4 py-1 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700">
                    Dashboard
                </button>
            }


            <SavePipelineButton />

            <ShareButton />

            {/* <button className="px-4 py-1 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700">
                Download
            </button> */}
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
