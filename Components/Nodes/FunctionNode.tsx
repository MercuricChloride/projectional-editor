import { Handle, Position } from "reactflow";

export function FunctionNode({ data }: any) {
  return (
    <div className="rounded-full bg-green-500 p-3 max-w-36">
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
