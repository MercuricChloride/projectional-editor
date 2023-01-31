import { useRef, useState } from "react";
import { Handle, Position } from "reactflow";

export function FunctionNode({ data }: any) {
  const [displayCode, setDisplayCode] = useState(false);
  const [code, setCode] = useState(data.code);

  // pseudo code for how to update the node data
  // const setNode = useReactFlow();
  // const onCodeChange = (newCode: string) => {
  //  setCode(newCode);
  //  setNode((node) => {
  //   node.data.code = newCode;
  //   return node;
  // });

  return (
    <div
      className="rounded-full bg-green-500 p-3 max-w-36"
      onDoubleClick={() => setDisplayCode(true)}
      onMouseLeave={() => setDisplayCode(false)}
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
            onBlur={(e) => {
              setCode(e.target.value);
              setDisplayCode(false);
            }}
          >
            {data.code}
          </textarea>
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
