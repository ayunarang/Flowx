import * as Dialog from '@radix-ui/react-dialog';
import { LayoutDashboard } from 'lucide-react';
import DownloadButton from './DownloadButton';
import ShareButton from './ShareButton';
import AuthButton from './AuthButton';
import { SavePipelineButton } from './SavePipelineButton';
import PipelineNameInput from './PipelineNameInput';

export default function MoreOptionsDrawer({
  open,
  onOpenChange,
  isSignedIn,
  flowRef,
}) {

  const styles = "flex items-center gap-3 active:bg-gray-100 rounded px-2 py-4 text-base font-medium text-canvas-ink w-full";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 " />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 z-30">
          <div className="flex flex-col gap-1">

            {isSignedIn &&
              <PipelineNameInput />
            }

            <DownloadButton flowRef={flowRef} isDrawer styles={styles} />

            {isSignedIn ? (
              <>
                <button className={styles}>
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </button>

                <SavePipelineButton isDrawer styles={styles} />

                <ShareButton isDrawer styles={styles} />

                <AuthButton isDrawer styles={styles} />
              </>
            ) : (
              <>
                <AuthButton isDrawer styles={styles} />
                <SavePipelineButton isDrawer styles={styles} />
                <ShareButton isDrawer styles={styles} />
              </>
            )}

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
