import * as Dialog from '@radix-ui/react-dialog';
import DownloadFormatToggle from './DownloadFormatToggle';

export default function DownloadDrawer({
  open,
  onOpenChange,
  format,
  setFormat,
  onDownload
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 z-40"
          onPointerDownOutside={() => onOpenChange(false)}
        >
          <h3 className="text-xl mb-5 font-medium">Download as</h3>

          <DownloadFormatToggle format={format} setFormat={setFormat} />

          <button
            onClick={onDownload}
            className="w-full bg-canvaPurple hover:bg-canvaPurple-hover active:bg-canvaPurple-active text-white font-medium py-3 px-2 rounded-md text-base"
          >
            Download
          </button>

          <Dialog.Close asChild>
            <button
              className="mt-4 w-full text-sm text-gray-800 bg-gray-100 active:bg-gray-200 py-3 px-2 rounded-lg"
            >
              Cancel
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
