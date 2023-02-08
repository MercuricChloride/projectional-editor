import {
  editingNodeIdState,
  inputCodeState,
  nodeDataState,
  nodeState,
  shouldDisplayEditorState,
} from "@/State/atoms";
import { displayNodesSelector } from "@/State/selectors";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

export function FloatingTextEditor() {
  const [display, setDisplay] = useRecoilState(shouldDisplayEditorState);

  const [editingNodeId, setEditingNodeId] = useRecoilState(editingNodeIdState);

  const [sourceCode, setSourceCode] = useRecoilState(inputCodeState);

  const [nodes] = useRecoilValue(displayNodesSelector);

  const nodeData = nodes.find((node) => node.id === editingNodeId)?.data;

  const [code, setCode] = useState(nodeData.code);

  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (display) {
      ref.current?.focus();
    }
  }, [display]);

  const updateCode = (code: string) => {
    // get the start and end points for the source code snippet we are editing
    const { start, end } = nodeData.range;

    // split the source code into an array
    const splitSource = sourceCode.split("");

    // splice the new code into the source code
    splitSource.splice(start, end - start, code);

    // join the array back into a string
    const newSourceCode = splitSource.join("");

    // update the source code state
    setSourceCode(newSourceCode);

    // reset the editing node id
    setEditingNodeId("");

    // hide the editor
    setDisplay(false);
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
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            updateCode(code);
          }
          if (e.key === "Tab") {
            e.preventDefault();
            const start = ref.current?.selectionStart;
            const end = ref.current?.selectionEnd;
            const value = ref.current?.value;
            if (
              start !== undefined &&
              end !== undefined &&
              value !== undefined &&
              ref.current !== null
            ) {
              setCode(value.substring(0, start) + "\t" + value.substring(end));
              ref.current.selectionStart = ref.current.selectionEnd = start + 1;
            }
          }
        }}
      />
    </div>
  );
}
