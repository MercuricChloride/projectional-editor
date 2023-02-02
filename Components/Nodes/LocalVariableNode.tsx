import { Handle, Position } from "reactflow";

export function LocalVariableNode({ data }: any) {
  return (
    <div className="rounded-full bg-blue-200 p-3 z-0">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <div className="text-center">Local Variable:</div>
      <div className="text-center">{data.label}</div>
    </div>
  );
}
