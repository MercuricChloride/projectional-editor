import { Handle, Position } from "reactflow";
import { SyntaxNode } from "./SyntaxNode";

export function StateVariableNode({ data, id }: any) {
  return (
    <SyntaxNode id={id} style="rounded-full bg-blue-500 p-3">
      <div className="text-center">{data.visibility} State Variable:</div>
      <div className="text-center">{data.label}</div>
    </SyntaxNode>
  );
}
