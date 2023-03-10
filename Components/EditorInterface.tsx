import { useEffect } from "react";
import Parser from "web-tree-sitter";
import {
  fullScreenState,
  parserState,
  shouldDisplayEditorState,
} from "@/State/atoms";
import { useRecoilState } from "recoil";
import { TextEditor } from "./TextEditor";
import { GraphEditor } from "@/Components/GraphEditor";
import { FloatingTextEditor } from "./FloatingTextEditor";

export default function EditorInterface() {
  const [, setParser] = useRecoilState(parserState);
  const [shouldDisplayEditor, setShouldDisplayEditor] = useRecoilState(
    shouldDisplayEditorState
  );

  //@note this is a hack to get the parser to load
  //@todo I should put this into something that runs on app load
  const init = async () => {
    await Parser.init({
      locateFile(scriptName: string, scriptDirectory: string) {
        return scriptName;
      },
    });
    const Solidity = await Parser.Language.load("tree-sitter-solidity.wasm");
    console.log("Solidity", Solidity);

    const parser = new Parser();
    console.log("parser", parser);

    parser.setLanguage(Solidity);

    setParser(parser);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div
      className="h-screen w-screen flex flex-col"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setShouldDisplayEditor(false);
        }
      }}
    >
      <div className="flex w-full h-16 justify-center text-center">
        <h1 className="text-4xl font-bold">Beemr.xyz</h1>
      </div>
      <div className="flex flex-row w-full h-full">
        <div
          className={"h-full w-1/2 flex justify-center"}
          onClick={() => setShouldDisplayEditor(false)}
        >
          <TextEditor />
        </div>
        <div
          className="h-full w-1/2 flex justify-center"
          onClick={() => setShouldDisplayEditor(false)}
        >
          <GraphEditor />
        </div>
        {shouldDisplayEditor && <FloatingTextEditor />}
      </div>
    </div>
  );
}
