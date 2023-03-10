import { INode } from "@/Helpers/types";
import { nodeTypesState } from "@/State/atoms";
import { displayNodesSelector } from "@/State/selectors";
import { useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  Edge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";

export function GraphEditor() {
  //@note I am using a seperate selector here because I want to filter out nodes when we display, and don't want to filter the nodes in the state object
  //@note this returns Loadable<[nodes, edges]>
  const display = useRecoilValueLoadable(displayNodesSelector);

  const [displayNodes, displayEdges] =
    display.state === "hasValue" ? display.contents : [];

  //@note I am using local state here because I want to be able to interact with the nodes and edges so long as nobody is making changes to the source code
  const [nodes, setNodes, onNodesChange] = useNodesState(
    displayNodes as INode[]
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    displayEdges as Edge[]
  );

  if (display.state === "hasError") {
    console.error(display);
  }

  useEffect(() => {
    if (display.state === "hasValue" && displayNodes && displayEdges) {
      setNodes(displayNodes);
      setEdges(displayEdges);
    }
  }, [display]);

  const nodeTypes = useRecoilValue(nodeTypesState);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds as Edge[])),
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
