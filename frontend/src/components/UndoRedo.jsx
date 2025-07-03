import { Undo2Icon, Redo2Icon } from 'lucide-react';
import { useStore } from '../store';

export default function UndoRedoButtons() {
    const undo = useStore((state) => state.undo);
    const redo = useStore((state) => state.redo);
    const canEdit = useStore((state) => state.canEdit);
    const canUndo = useStore(state => state.canUndo());
    const canRedo = useStore(state => state.canRedo());

    if (!canEdit) return null;

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => {
                    undo();
                }}
                className={`${!canUndo ? 'text-gray-500' : 'text-canvas-ink'} flex items-center rounded text-xs font-medium p-1 sm:p-1`}
                title="Undo"
                disabled={!canUndo}
            >
                <Undo2Icon className="h-6 w-6 sm:h-5 sm:w-5" />
            </button>

            <button
                onClick={() => {
                    redo();
                }}
                className={`${!canRedo ? 'text-gray-400' : 'text-canvas-ink'} flex items-center rounded text-xs font-medium p-1 sm:p-1`}
                title="Redo"
                disabled={!canRedo}

            >
                <Redo2Icon className="h-6 w-6 sm:h-5 sm:w-5" />
            </button>
        </div>
    );
}
