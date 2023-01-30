import { Handle, Position } from "reactflow";

export function ContractNode({ data }: any) {
  return (
    <div className="rounded-full bg-gray-500 p-3">
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555", left: "50%" }}
      />
      <div className="text-center">{data.visibility} Contract:</div>
      <div className="text-center">{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555", left: "50%" }}
      />
    </div>
  );
}
