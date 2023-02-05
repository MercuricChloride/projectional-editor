import {
  editingNodeIdState,
  inputCodeState,
  nodeDataState,
  shouldDisplayEditorState,
} from "@/State/atoms";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

export function FloatingTextEditor() {
  const [display, setDisplay] = useRecoilState(shouldDisplayEditorState);

  const editingNodeId = useRecoilValue(editingNodeIdState);

  const [nodeData, setNodeData] = useRecoilState(nodeDataState(editingNodeId));

  const ref = useRef<HTMLTextAreaElement>(null);

  const [code, setCode] = useState(nodeData.code);

  console.log(nodeData);
  useEffect(() => {
    console.log("updated node id");
    console.log(nodeData);
  }, [editingNodeId]);

  useEffect(() => {
    if (display) {
      ref.current?.focus();
    }
  }, [display]);

  const [sourceCode, setSourceCode] = useRecoilState(inputCodeState);

  const updateCode = (code: string) => {
    if (code === nodeData.code) return;
    // split the source code into an array
    const splitSource = sourceCode.split("");

    // get the start and end points for the source code snippet we are editing
    const { start, end } = nodeData.range;

    // splice the new code into the source code
    splitSource.splice(start, end - start, code);

    // join the array back into a string
    const newSourceCode = splitSource.join("");

    // update the source code state
    setSourceCode(newSourceCode);

    // update the node data
    setNodeData({
      ...nodeData,
      code,
      range: {
        start,
        end: start + code.length,
      },
    });
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-200 border-2 border-black">
      <div className="h-8 w-full bg-gray-300 border-b-2 border-black">
        <div className="text-center">{nodeData.label}</div>
      </div>
      <textarea
        className="border-2 border-black h-full w-full"
        value={code}
        ref={ref}
        onChange={(e) => setCode(e.target.value)}
        onBlur={() => {
          updateCode(code);
          setDisplay(false);
        }}
      />
    </div>
  );
}
