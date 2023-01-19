import {
  getContract,
  getStateVariables,
  positionNodes,
} from "@/Helpers/helpers";
import Flow from "@/pages/flow";
import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    const newNodes: any = [];

    // get all contract definitions
    try {
      visit(parsed, {
        ContractDefinition: (node: any) => {
          // x offset is 200 * number of contracts
          const xOffset =
            200 *
            newNodes.reduce(
              (acc: any, node: any) => (node.id.includes("-") ? acc + 1 : acc),
              0
            );

          const yOffset = (index: number) => 100 * index;

          const contractNodes: any = [
            getContract(node),
            ...getStateVariables(node),
          ];

          const positionedNodes = positionNodes(
            contractNodes,
            xOffset,
            yOffset
          );

          console.log("positionedNodes: ", positionedNodes);

          newNodes.push(...positionedNodes);
        },
      });
    } catch (e) {
      console.error("Something went wrong: ", e);
    }
    console.log("newNodes: ", newNodes);
    setNodes(newNodes);
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
