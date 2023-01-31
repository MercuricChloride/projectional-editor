import { useCallback, useEffect, useMemo, useState } from "react";
import { ContractNode } from "./ContractNode";
import { FunctionNode } from "./FunctionNode";
import { LocalVariableNode } from "./LocalVariableNode";
import { StateVariableNode } from "./StateVariableNode";
import Parser, { Tree } from "web-tree-sitter";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import {
  captureToScopeRange,
  contractGoodies,
  goodiesToINodes,
} from "@/Helpers/treeHelpers";
import {
  DEFAULT_NODE_HEIGHT,
  DEFAULT_NODE_WIDTH,
  formatNodes,
} from "@/Helpers/helpers";
import Flow from "@/pages/flow";
import {
  nodeState,
  edgeState,
  parserState,
  inputCodeState,
  nodeTypesState,
} from "@/State/atoms";
import { parsedTreeSelector } from "@/State/selectors";
import { useRecoilState, useRecoilValue } from "recoil";

export default function EditorInterface() {
  const [inputCode, setInputCode] = useRecoilState(inputCodeState);

  const [nodes, setNodes] = useRecoilState(nodeState);
  const [edges, setEdges] = useRecoilState(edgeState);
  const nodeTypes = useRecoilValue(nodeTypesState);

  const [detailLevel, setDetailLevel] = useState(3);
  const [nodeTypesToRemove, setNodeTypesToRemove] = useState<string[]>();

  // parser class
  const [parser, setParser] = useRecoilState(parserState);

  // parsed syntax tree
  // changes whenever the input code changes
  const parsedTree = useRecoilValue(parsedTreeSelector);

  const init = async () => {
    await Parser.init({
      locateFile(scriptName: string, scriptDirectory: string) {
        return scriptName;
      },
    });
    const Solidity = await Parser.Language.load("tree-sitter-solidity.wasm");

    const parser = new Parser();

    parser.setLanguage(Solidity);

    setParser(parser);
  };

  useEffect(() => {
    init();
  }, []);

  //@todo put this into a selector or something
  async function onParseUpdate() {
    if (parsedTree) {
      const language = parsedTree.getLanguage();

      const goodies = contractGoodies(language).matches(parsedTree.rootNode);
      console.log("goodies", goodies);

      const scopeRange = goodies.flatMap((goodie) => {
        return captureToScopeRange(goodie.captures);
      });

      // sort by start position
      scopeRange.sort((a, b) => a.start - b.end);

      // unpositioned nodes
      const rawNodes = goodies.flatMap((goodie) => {
        return goodiesToINodes(
          goodie,
          DEFAULT_NODE_HEIGHT,
          DEFAULT_NODE_WIDTH,
          scopeRange
        );
      });

      const [nodes, edges] = await formatNodes(
        rawNodes.filter(
          (node) =>
            node.id.split("-").length <= detailLevel &&
            !nodeTypesToRemove?.includes(node.type)
        )
      );
      setNodes(nodes);
      setEdges(edges);
    }
  }

  useEffect(() => {
    onParseUpdate();
  }, [parsedTree, detailLevel]);

  return (
    <div className="h-screen w-screen flex">
      <div className="h-full w-1/2 flex justify-center">
        <div className="flex flex-col h-full w-full justify-flex-start">
          <div className="flex bg-slate-200 border-black border-2 justify-around">
            <div className="flex flex-col">
              {Object.keys(nodeTypes).map((nodeType) => (
                <div className="flex flex-row" key={nodeType}>
                  <input
                    type="checkbox"
                    checked={!nodeTypesToRemove?.includes(nodeType)}
                    onChange={(e) => {
                      if (!e.target.checked) {
                        setNodeTypesToRemove([
                          ...(nodeTypesToRemove || []),
                          nodeType,
                        ]);
                      } else {
                        setNodeTypesToRemove(
                          nodeTypesToRemove?.filter((t) => t !== nodeType)
                        );
                      }
                    }}
                  />
                  <label>{nodeType}</label>
                </div>
              ))}
            </div>
            <div className="flex flex-col w-3/12 justify-around">
              <button
                className="bg-slate-400 rounded-full"
                onClick={() => {
                  setDetailLevel(detailLevel + 1);
                }}
              >
                Increase Detail
              </button>
              Detail Level: {detailLevel}
              <button
                className="bg-slate-400 rounded-full"
                onClick={() => {
                  setDetailLevel(detailLevel - 1);
                }}
              >
                Decrease Detail
              </button>
            </div>
          </div>
          <AceEditor
            mode="java"
            value={inputCode}
            onChange={(code) => {
              setInputCode(code);
            }}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            height="100%"
            width="100%"
            fontSize={16}
          />
        </div>
      </div>
      <div className="h-full w-1/2 flex justify-center">
        <Flow />
      </div>
    </div>
  );
}
