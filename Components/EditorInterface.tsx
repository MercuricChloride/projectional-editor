import { useEffect } from "react";
import Parser from "web-tree-sitter";
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
import {
  nodeState,
  edgeState,
  parserState,
  detailLevelState,
} from "@/State/atoms";
import { parsedTreeSelector } from "@/State/selectors";
import { useRecoilState, useRecoilValue } from "recoil";
import { TextEditor } from "./TextEditor";
import { GraphEditor } from "@/Components/GraphEditor";

export default function EditorInterface() {
  const [, setParser] = useRecoilState(parserState);

  //@note this is a hack to get the parser to load
  //@todo I should put this into something that runs on app load
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

  return (
    <div className="h-screen w-screen flex">
      <div className="h-full w-1/2 flex justify-center">
        <TextEditor />
      </div>
      <div className="h-full w-1/2 flex justify-center">
        <GraphEditor />
      </div>
    </div>
  );
}
