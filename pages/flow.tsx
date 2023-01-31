import { edgeState, nodeState, nodeTypesState } from "@/State/atoms";
import { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  NodeChange,
  applyNodeChanges,
  applyEdgeChanges,
  EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { useRecoilState, useRecoilValue } from "recoil";

export default function Flow() {
  const [nodes, setNodes] = useRecoilState(nodeState);
  const [edges, setEdges] = useRecoilState(edgeState);
  const nodeTypes = useRecoilValue(nodeTypesState);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      // @ts-ignore
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    //@ts-ignore
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onConnect={onConnect}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}
