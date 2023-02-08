import { SyntaxNode } from "./SyntaxNode";

export function FunctionNode({ id, data }: any) {
  return (
    <SyntaxNode id={id} style="rounded-full bg-green-500 p-3">
      <div className="text-center">{data.visibility} Function:</div>
      <div className="text-center">{data.label}</div>
    </SyntaxNode>
  );
}
