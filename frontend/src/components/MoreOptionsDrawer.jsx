import * as Dialog from '@radix-ui/react-dialog';
import DownloadButton from './DownloadButton';
import ShareButton from './ShareButton';
import AuthButton from './AuthButton';
import { SavePipelineButton } from './SavePipelineButton';
import PipelineNameInput from './PipelineNameInput';
import DashboardButton from './DashboardButton';
import { PlusIcon } from 'lucide-react';
import { useSavePipeline } from '../hooks/useSavePipeline';
import ResetButton from './ResetButton';
import { useStore } from '../store';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function MoreOptionsDrawer({
  open,
  onOpenChange,
  isSignedIn,
  flowRef,
}) {

  const { user } = useAuth();
  const { savePipeline } = useSavePipeline();
  const setNodes = useStore((state) => state.setNodes)
  const setEdges = useStore((state) => state.setEdges)
  const navigate = useNavigate()

  const styles = "flex items-center gap-3 active:bg-gray-100 rounded px-2 py-4 text-base font-medium text-canvas-ink w-full";

  const handleNewPipeline = () => {
    savePipeline(user, { showToast: false });
    setNodes([])
    setEdges([])
    navigate("/")
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 z-50">
          <div className="flex flex-col gap-1">

            {isSignedIn &&
              <div className='sm:hidden'>
                <PipelineNameInput />
              </div>
            }

            <DownloadButton flowRef={flowRef} isDrawer styles={styles} />

            {isSignedIn ? (
              <>
                <DashboardButton isDrawer styles={styles} />

                <SavePipelineButton isDrawer styles={styles} onOpenChange={onOpenChange} />

                <button
                  onClick={handleNewPipeline}
                  className={styles}
                >
                  <PlusIcon className="h-6 sm:h-5 w-6 sm:w-5" />
                  New Pipeline
                </button>

                <ResetButton isDrawer styles={styles} />

                <ShareButton isDrawer styles={styles} onOpenChange={onOpenChange} />

                <AuthButton isDrawer styles={styles} onOpenChange={onOpenChange} />
              </>
            ) : (
              <>
                <AuthButton isDrawer styles={styles} onOpenChange={onOpenChange} />
                <SavePipelineButton isDrawer styles={styles} onOpenChange={onOpenChange} />
                <ResetButton isDrawer styles={styles} />
                <ShareButton isDrawer styles={styles} onOpenChange={onOpenChange} />
              </>
            )}

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
