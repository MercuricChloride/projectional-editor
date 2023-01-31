import { inputCodeState } from "@/State/atoms";
import { useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import { useRecoilState } from "recoil";

export function FunctionNode({ data, id }: any) {
  const { label, code: inputCode, range } = data;
  const [displayCode, setDisplayCode] = useState(false);
  const [code, setCode] = useState(inputCode);
  const [sourceCode, setSourceCode] = useRecoilState(inputCodeState);

  const onCodeChange = (code: string) => {
    const newSourceCode = sourceCode.split("");
    const { start, end } = range;
    console.log("updating");
    newSourceCode.splice(start, end - start, code);
    setSourceCode(newSourceCode.join(""));
  };

  const CodeDisplay = () => {
    return (
      <div className="text-center mt-3 bg-white h-32 w-32 z-50 static">
        Code:
        <textarea
          className="w-full h-full"
          style={{
            zIndex: 99,
          }}
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onBlur={() => {
            if (code !== inputCode) {
              onCodeChange(code);
            }
            setDisplayCode(false);
          }}
          onMouseLeave={() => {
            if (code !== inputCode) {
              onCodeChange(code);
            }
            setDisplayCode(false);
          }}
        ></textarea>
      </div>
    );
  };

  // create a css style that animates the node when double clicked, bringing up the code editor and then animates it back down when the mouse leaves the code editor
  return (
    <div
      className="rounded-full bg-green-500 p-6"
      onDoubleClick={() => setDisplayCode(true)}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      {displayCode ? (
        <CodeDisplay />
      ) : (
        <>
          <div className="text-center">{data.visibility} Function:</div>
          <div className="text-center">{data.label}</div>
        </>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
    </div>
  );
}
