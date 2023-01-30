import { Handle, Position } from "reactflow";

export function StateVariableNode({ data }: any) {
  return (
    <div className="rounded-full bg-blue-500 p-3">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <div className="text-center">{data.visibility} State Variable:</div>
      <div className="text-center">{data.label}</div>
    </div>
  );
}
