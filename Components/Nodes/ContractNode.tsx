import { Handle, Position } from "reactflow";

export function ContractNode({ data }: any) {
  return (
    <div className="rounded-full bg-gray-500 p-3 z-0">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <div className="text-center">{data.visibility} Contract:</div>
      <div className="text-center">{data.label}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
    </div>
  );
}
