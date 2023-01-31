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

  return (
    <div
      className="rounded-full bg-green-500 p-3 max-w-36"
      onDoubleClick={() => setDisplayCode(true)}
      onMouseLeave={() => {
        if (code !== inputCode) {
          onCodeChange(code);
        }
        setDisplayCode(false);
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      {displayCode ? (
        <div className="text-center mt-3 bg-white">
          <div>Code:</div>
          <textarea
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
          ></textarea>
        </div>
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
