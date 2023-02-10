import { Handle, Position } from "reactflow";
import { SyntaxNode } from "./SyntaxNode";

export function StateVariableNode({ data, id }: any) {
  return (
    <SyntaxNode
      id={id}
      style="rounded bg-blue-500 p-3 min-w-40"
      data={data}
      subTypes={[]}
    >
      <div className="text-center break-word">
        {data.node.childForFieldName("type")?.text}
      </div>
      <div className="text-center">{data.visibility}</div>
      <div className="text-center break-word">{data.label}</div>
    </SyntaxNode>
  );
}
