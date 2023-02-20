import { inputCodeState } from "@/State/atoms";
import { useRecoilState } from "recoil";
import AceEditor from "react-ace";
import { RemoveNodeTypeDisplay } from "./RemoveNodeTypeDisplay";
import { ChangeDetailButton } from "./ChangeDetailButton";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { useEffect, useState } from "react";

export function TextEditor() {
  const [inputCode, setInputCode] = useRecoilState(inputCodeState);
  const [code, setCode] = useState(inputCode);

  useEffect(() => {
    setCode(inputCode);
  }, [inputCode]);

  return (
    <div
      className="flex flex-col h-full w-full justify-flex-start"
      onMouseDown={() => {
        setInputCode(code);
      }}
      onMouseLeave={() => {
        setInputCode(code);
      }}
    >
      <div className="flex bg-slate-200 border-black border-2 justify-around">
        <ChangeDetailButton />
      </div>
      <AceEditor
        value={code}
        tabSize={2}
        onChange={(code) => {
          setCode(code);
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
