import {
  getContract,
  getStateVariables,
  INode,
  positionNodes,
} from "@/Helpers/helpers";
import Flow from "@/pages/flow";
import { useEffect, useState } from "react";
require("@solidity-parser/parser/dist/index.iife.js");

export default function Editor() {
  // @ts-ignore
  const SolidityParser: any = window.SolidityParser;
  const { parse, visit, loc } = SolidityParser;

  const [text, setText] = useState("");
  const [parsed, setParsed] = useState("");
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  useEffect(() => {
    try {
      setParsed(parse(text, { loc: true }));
    } catch (_) {}
  }, [text]);

  async function onParseUpdate() {
    // we are using a set to track each contract and it's sub nodes
    const contracts: Set<INode> = new Set();

    // we then are going to get each contract and it's sub nodes
    // then push it to the set
    // then after the visitor is all finished, we will position the nodes

    try {
      visit(parsed, {
        ContractDefinition: async (node: any) => {
          // All the nodes that will be added to the graph that are a contract definition or inside a contract definition
          const contractNodes: any = [
            getContract(node),
            ...getStateVariables(node),
          ];

          // Add the contract to the set
          contracts.add(contractNodes);
        },
      });
    } catch (e) {
      console.error("Something went wrong: ", e);
    }

    // Position the nodes
    const [newNodes, newEdges] = await positionNodes(Array.from(contracts));

    // only set the nodes if there are new nodes to set, IE not in the middle of editing
    if (newNodes.length > 0) {
      console.log("Setting nodes and edges: ", newNodes);
      console.log("Setting nodes and edges: ", newEdges);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }

  useEffect(() => {
    onParseUpdate();
  }, [parsed]);

  return (
    <div className="h-screen w-screen flex">
      <div className="h-full w-1/2 flex justify-center">
        <textarea
          className="flex bg-slate-200 h-full w-full"
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </div>
      <div className="h-full w-1/2 flex justify-center">
        <Flow defaultNodes={nodes} defaultEdges={edges} />
      </div>
    </div>
  );
}
