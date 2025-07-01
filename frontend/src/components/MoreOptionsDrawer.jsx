import * as Dialog from '@radix-ui/react-dialog';
import {
  Download,
  LogIn,
  Share2,
  Save,
  LayoutDashboard,
  LogOut
} from 'lucide-react';


export default function MoreOptionsDrawer({
  open,
  onOpenChange,
  isSignedIn,
  onDownloadClick,
  onAuthClick,
}) {
  const handleClick = (action) => {
    onOpenChange(false);
    action();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 z-50">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleClick(onDownloadClick)}
              className="flex items-center gap-2"
            >
              <Download className="w-5 h-5" /> Download
            </button>
            {isSignedIn ? (
              <>
                <button className="flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </button>
                <button className="flex items-center gap-2">
                  <Save className="w-5 h-5" /> Save
                </button>
                <button className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" /> Share
                </button>
                <button className="flex items-center gap-2">
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleClick(onAuthClick)}
                  className="flex items-center gap-2"
                >
                  <LogIn className="w-5 h-5" /> Sign In
                </button>
                <button className="flex items-center gap-2">
                  <Save className="w-5 h-5" /> Save
                </button>
                <button className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" /> Share
                </button>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

