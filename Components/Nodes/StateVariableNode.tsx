import { Handle, Position } from "reactflow";

export function StateVariableNode({ data }: any) {
  return (
    <div className="rounded-full bg-blue-500 p-3">
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555", left: "50%" }}
      />
      <div className="text-center">{data.visibility} State Variable:</div>
      <div className="text-center">{data.label}</div>
    </div>
  );
}
