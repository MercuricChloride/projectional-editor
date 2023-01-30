import { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";

interface Props {
  nodes: any[];
  edges: Edge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  nodeTypes: any;
}

// export default function Flow({ defaultNodes, defaultEdges, nodeTypes }: Props) {
export default function Flow({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodeTypes,
}: Props) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={nodes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onConnect={onConnect}
      // nodesDraggable={true}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}
