import {
  editingNodeIdState,
  inputCodeState,
  nodeDataState,
  nodeState,
  parserState,
  shouldDisplayEditorState,
} from "@/State/atoms";
import { use, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { useRecoilState } from "recoil";

export function FunctionNode({ data, id }: any) {
  const [, setShouldDisplayEditor] = useRecoilState(shouldDisplayEditorState);

  const [, setEditingNodeId] = useRecoilState(editingNodeIdState);

  const [, setNodeData] = useRecoilState(nodeDataState(id));

  useEffect(() => {
    setNodeData(data);
  }, []);

  return (
    <div
      className="rounded-full bg-green-500 p-6 z-0"
      onDoubleClick={() => {
        setEditingNodeId(id);
        setShouldDisplayEditor(true);
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <div className="text-center">{data.visibility} Function:</div>
      <div className="text-center">{data.label}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
    </div>
  );
}
