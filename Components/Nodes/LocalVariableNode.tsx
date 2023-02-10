import { Handle, Position } from "reactflow";
import { SyntaxNode } from "./SyntaxNode";

export function LocalVariableNode({ data, id }: any) {
  return (
    <SyntaxNode
      id={id}
      style="rounded-full bg-blue-200 p-3 z-0"
      data={data}
      subTypes={[]}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <div className="text-center">Local Variable:</div>
      <div className="text-center">{data.label}</div>
    </SyntaxNode>
  );
}
