import { edgeState, nodeState, nodeTypesState } from "@/State/atoms";
import { displayNodesSelector } from "@/State/selectors";
import { Suspense, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  NodeChange,
  applyNodeChanges,
  applyEdgeChanges,
  EdgeChange,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";

export function GraphEditor() {
  //@note I am using a seperate selector here because I want to filter out nodes when we display, and don't want to filter the nodes in the state object
  //@note this returns Loadable<[nodes, edges]>
  const display = useRecoilValueLoadable(displayNodesSelector);

  const [nodes, edges] = display.state === "hasValue" ? display.contents : [];

  if (display.state === "hasError") {
    console.error(display.contents);
  }

  const [, setNodes] = useRecoilState(nodeState);
  const [, setEdges] = useRecoilState(edgeState);
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
