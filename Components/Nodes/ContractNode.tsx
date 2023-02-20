import { SyntaxNode } from "./SyntaxNode";

export function ContractNode({ data, id }: any) {
  return (
    <SyntaxNode
      id={id}
      style="rounded-full bg-gray-500 p-3 z-0"
      data={data}
      subTypes={["function", "constructor", "stateVariable"]}
    >
      <div className="text-center">Contract:</div>
      <div className="text-center">{data.label}</div>
    </SyntaxNode>
  );
}
