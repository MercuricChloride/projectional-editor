import Flow from "@/pages/flow";
import { useEffect, useMemo, useState } from "react";
import { ContractNode } from "./ContractNode";
import { FunctionNode } from "./FunctionNode";
import { LocalVariableNode } from "./LocalVariableNode";
import { StateVariableNode } from "./StateVariableNode";
import Parser, { Tree } from "web-tree-sitter";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

export default function EditorInterface() {
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
  const [parsedTree, setParsedTree] = useState<Tree>();
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [detailLevel, setDetailLevel] = useState(3);
  const [nodeTypesToRemove, setNodeTypesToRemove] = useState<string[]>();
  const nodeTypes = useMemo(
    () => ({
      function: FunctionNode,
      stateVariable: StateVariableNode,
      localVariable: LocalVariableNode,
      contract: ContractNode,
    }),
    []
  );

  const [parser, setParser] = useState<Parser>();

  const init = async () => {
    await Parser.init({
      locateFile(scriptName: string, scriptDirectory: string) {
        return scriptName;
      },
    });
    const Solidity = await Parser.Language.load("tree-sitter-solidity.wasm");

    const parser = new Parser();
    parser.setLanguage(Solidity);
    console.log(parser);
    setParser(parser);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    try {
      // TODO: CONVERT THIS TO TREE-SITTER
      if (parser) {
        const tree = parser.parse(text, parsedTree);
        setParsedTree(tree);

        const walker = tree.walk();
        console.log("FIRST NODE", walker.currentNode());
        while (walker.gotoFirstChild()) {
          console.log("CURRENT NODE", walker.currentNode());
        }

        console.log("Named children", tree.rootNode.namedChildren);
      }
    } catch (_) {}
  }, [text]);

  async function onParseUpdate() {
    // TODO: CONVERT THIS FUNCTION TO WORK ON TREE-SITTER
  }

  useEffect(() => {
    onParseUpdate();
  }, [parsed, detailLevel, nodeTypesToRemove]);

  return (
    <div className="h-screen w-screen flex">
      <div className="h-full w-1/2 flex justify-center">
        <div className="flex flex-col h-full w-full justify-flex-start">
          <div className="flex bg-slate-200 border-black border-2 justify-around">
            <div className="flex flex-col">
              Types to show:
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
            theme="monokai"
            value={text}
            keyboardHandler="vim"
            onChange={(code) => {
              setText(code);
            }}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            height="100%"
          />
        </div>
      </div>
      <div className="h-full w-1/2 flex justify-center">
        <Flow defaultNodes={nodes} defaultEdges={edges} nodeTypes={nodeTypes} />
      </div>
    </div>
  );
}
