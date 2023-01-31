import { inputCodeState } from "@/State/atoms";
import { useRecoilState } from "recoil";
import AceEditor from "react-ace";
import { RemoveNodeTypeDisplay } from "./RemoveNodeTypeDisplay";
import { ChangeDetailButton } from "./ChangeDetailButton";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

export function TextEditor() {
  const [inputCode, setInputCode] = useRecoilState(inputCodeState);

  return (
    <div className="flex flex-col h-full w-full justify-flex-start">
      <div className="flex bg-slate-200 border-black border-2 justify-around">
        <div className="flex flex-col">
          <RemoveNodeTypeDisplay />
        </div>
        <ChangeDetailButton />
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
  );
}
