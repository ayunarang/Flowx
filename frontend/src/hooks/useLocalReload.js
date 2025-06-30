import { useEffect } from 'react';
import { useStore } from '../store'; 

export default function useLocalReload({ user, pipelineId }) {
  const setNodes = useStore((state) => state.setNodes);
  const setEdges = useStore((state) => state.setEdges);

  useEffect(() => {
    if (user || pipelineId) return;

    const saved = localStorage.getItem('pipeline_draft');
    if (saved) {
      try {
        const { nodes, edges } = JSON.parse(saved);
        if (nodes && edges) {
          console.log('Restoring local draft:', { nodes, edges });
          setNodes(nodes);
          setEdges(edges);
        }
      } catch (err) {
        console.error('Failed to load local draft:', err);
      }
    }
  }, [user, pipelineId, setNodes, setEdges]);
}
