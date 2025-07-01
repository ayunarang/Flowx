import * as Dialog from '@radix-ui/react-dialog';

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
          <h3 className="text-lg mb-2">Download as</h3>

          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full border p-2 mb-4"
          >
            <option value="png">PNG</option>
            <option value="pdf">PDF</option>
          </select>

          <button
            onClick={onDownload}
            className="w-full bg-blue-600 text-white p-2 rounded-md"
          >
            Download
          </button>

          <Dialog.Close asChild>
            <button
              className="mt-4 w-full text-sm text-gray-800 bg-gray-100 px-3 py-2 rounded-lg"
            >
              Cancel
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
