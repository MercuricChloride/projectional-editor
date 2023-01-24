import {
  defaultINode,
  formatNodes,
  getContract,
  getFunctionDeclarations,
  getNodeId,
  getScopeRange,
  getStateVariables,
  INode,
  positionNodes,
  ScopeRange,
} from "@/Helpers/helpers";
import Flow from "@/pages/flow";
import {
  ContractDefinition,
  FunctionDefinition,
  VariableDeclaration,
} from "@solidity-parser/parser/dist/src/ast-types";
import { useEffect, useState } from "react";
require("@solidity-parser/parser/dist/index.iife.js");

export default function Editor() {
  // @ts-ignore
  const SolidityParser: any = window.SolidityParser;
  const { parse, visit, loc } = SolidityParser;

  const [text, setText] = useState(`\
contract Test {
  uint public num;
  
  uint public num2;
  
  string private secretStr;


  function test() public { 
    num = 69;
  }

  function shouldHaveLocal() public {
    uint local;
  }
}`);
  const [parsed, setParsed] = useState("");
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  useEffect(() => {
    try {
      const parsed = parse(text, { loc: true, range: true });
      console.log("parsed tree", parsed);
      // debugger;
      setParsed(parsed);
    } catch (_) {}
    if (!text) {
      console.log("Error");
      setNodes([]);
      setEdges([]);
    }
  }, [text]);

  async function onParseUpdate() {
    // we are using a set to track each contract and it's sub nodes

    const newTestNodes: INode[] = [];

    const ranges: ScopeRange[] = [];

    try {
      visit(parsed, {
        ContractDefinition: async (node: ContractDefinition) => {
          const { range, name } = node;
          console.log("ContractDefinition: ", node);

          if (!range) {
            console.error("No range found for node: ", node);
            return;
          }

          // Add the range to the list of ranges
          const nodeScope = getScopeRange(range, name);
          ranges.push(nodeScope);

          // Add the contract to the new test nodes
          const nodeID = getNodeId(ranges, nodeScope.start);
          const emptyNode = defaultINode();
          const _node = {
            ...emptyNode,
            id: nodeID,
            label: name,
            data: {
              type: "contract",
              label: name,
              name,
              range,
            },
          };
          newTestNodes.push(_node);
        },

        FunctionDefinition: async (node: FunctionDefinition) => {
          const { range, name } = node;
          console.log("FunctionDefinition: ", node);

          if (!range) {
            console.error("No range found for node: ", node);
            return;
          }

          // Add the range to the list of ranges
          const nodeScope = getScopeRange(range, name);
          ranges.push(nodeScope);

          // Add the contract to the new test nodes
          const nodeID = getNodeId(ranges, nodeScope.start);
          const emptyNode = defaultINode();
          const _node = {
            ...emptyNode,
            id: nodeID,
            label: name,
            data: {
              type: "function",
              label: name,
              name,
              range,
            },
          };
          newTestNodes.push(_node);
        },

        VariableDeclaration: async (node: VariableDeclaration) => {
          console.log("VariableDeclaration: ", node);
          const { range, name } = node;

          const nodeScope = getScopeRange(range, name);
          ranges.push(nodeScope);

          // Add the contract to the new test nodes
          const nodeID = getNodeId(ranges, nodeScope.start);
          const emptyNode = defaultINode();
          const _node = {
            ...emptyNode,
            id: nodeID,
            label: name,
            data: {
              type: "variable",
              label: name,
              name,
              range,
            },
          };
          newTestNodes.push(_node);
        },
      });
    } catch (e) {
      console.error("Something went wrong: ", e);
    }
    console.log("New test nodes: ", newTestNodes);
    // Position the nodes
    const [newNodes, newEdges] = await formatNodes(newTestNodes);

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
          value={text}
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
