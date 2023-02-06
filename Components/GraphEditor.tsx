import { formatNodes, simpleDisplay, simpleEdges } from "@/Helpers/treeHelpers";
import { edgeState, nodeState, nodeTypesState } from "@/State/atoms";
import { displayNodesSelector, parsedTreeSelector } from "@/State/selectors";
import { Suspense, useCallback, useEffect, useState } from "react";
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

  const parsedTree = useRecoilValue(parsedTreeSelector);

  const [simpleNodes, setSimpleNodes] = useState<any[]>([]);
  const [simpleEdge, setSimpleEdge] = useState<any[]>([]);

  async function updateNodes() {
    const typesToDisplay = ["contract_declaration", "function_definition"];
    if (parsedTree?.rootNode) {
      const nodes = simpleDisplay(parsedTree?.rootNode);
      const edges = simpleEdges(nodes);
      const [nodesToDisplay, edgesToDisplay] = await formatNodes(nodes);
      setSimpleNodes(nodesToDisplay);
      setSimpleEdge(edgesToDisplay);
      console.log("simpleDisplay result: ", nodes);
      console.log("simpleEdges result: ", edges);
    }
  }

  useEffect(() => {
    updateNodes();
  }, [parsedTree]);

  return (
    <ReactFlow
      // nodes={nodes}
      // edges={edges}
      nodes={simpleNodes}
      edges={simpleEdge}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onConnect={onConnect}
      onContextMenu={(event) => {
        event.preventDefault();
        console.log("context menu", event);
      }}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}
