import { inputCodeState, nodeState, parserState } from "@/State/atoms";
import { use, useEffect } from "react";
import { useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import { useRecoilState, useRecoilValue } from "recoil";

export function FunctionNode({ data, id }: any) {
  const { label, code: inputCode, range: inputRange } = data;
  const [displayCode, setDisplayCode] = useState(false);
  const [sourceCode, setSourceCode] = useRecoilState(inputCodeState);
  const [nodes, setNodes] = useRecoilState(nodeState);
  const parser = useRecoilValue(parserState);
  const ref = useRef<HTMLTextAreaElement>(null);

  const [range, setRange] = useState(inputRange);

  const onCodeChange = (code: string) => {
    // split the source code into an array
    const splitSource = sourceCode.split("");

    // get the start and end points for the source code snippet we are editing
    const { start, end } = range;

    // splice the new code into the source code
    splitSource.splice(start, end - start, code);

    // join the array back into a string
    const newSourceCode = splitSource.join("");

    // update the source code state
    const newNodes = () => {
      return nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              code,
            },
          };
        } else {
          return node;
        }
      });
    };

    // update the range state to match this new code
    setRange({
      start,
      end: start + code.length,
    });

    setNodes(newNodes());
    setSourceCode(newSourceCode);
  };

  const [code, setCode] = useState(inputCode);

  useEffect(() => {
    if (displayCode) {
      ref.current?.focus();
    }
  }, [displayCode]);

  return (
    <div
      className="rounded-full bg-green-500 p-6 z-0"
      onDoubleClick={() => setDisplayCode(true)}
      onMouseLeave={() => setDisplayCode(false)}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      {displayCode ? (
        // <div
        //   style={{
        //     position: "absolute",
        //     zIndex: 100,
        //     width: "300px",
        //     height: "300px",
        //   }}
        //   hidden={!displayCode}
        // >
        //   Code:
        <textarea
          hidden={!displayCode}
          ref={ref}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              if (!ref.current) return;
              if (!ref.current?.value) return;
              const start = ref.current?.selectionStart;
              const end = ref.current?.selectionEnd;
              const value = ref.current?.value;
              const before = value?.substring(0, start);
              const after = value?.substring(end);
              ref.current.value = before + "\t" + after;
              ref.current.selectionStart = ref.current.selectionEnd = start + 1;
            }
          }}
          style={{
            // display: "absolute",
            width: "300px",
            height: "300px",
            zIndex: 100,
          }}
          rows={code.split("\n").length}
          onMouseLeave={() => {
            onCodeChange(code);
          }}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        ></textarea>
      ) : (
        // </div>
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
