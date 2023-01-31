import { ContractNode } from "@/Components/Nodes/ContractNode";
import { FunctionNode } from "@/Components/Nodes/FunctionNode";
import { LocalVariableNode } from "@/Components/Nodes/LocalVariableNode";
import { StateVariableNode } from "@/Components/Nodes/StateVariableNode";
import { INode } from "@/Helpers/helpers";
import { atom } from "recoil";
import { Edge } from "reactflow";
import Parser from "web-tree-sitter";

export const nodeState = atom<INode[]>({
  key: 'nodeState',
  default: [],
});

export const edgeState = atom<Edge[]>({
  key: 'edgeState',
  default: [],
});

export const nodeTypesState = atom({
  key: 'nodeTypes',
  default: {
    function: FunctionNode,
    stateVariable: StateVariableNode,
    localVariable: LocalVariableNode,
    contract: ContractNode,
  },
});

export const detailLevelState = atom({
  key: 'detailLevel',
  default: 3,
});

export const nodeTypesToRemoveState = atom<string[]>({
  key: 'nodeTypesToRemove',
  default: [],
});

export const parserState = atom<Parser>({
  key: 'parser',
  default: undefined
});

export const inputCodeState = atom<string>({
  key: 'inputCode',
  default: `\
contract Test {
  uint public num;
  
  uint public num2;
  
  string private secretStr;


  function test() public { 
    num = 69;
  }

  function shouldHaveLocal() public {
    uint local;
  }
}
contract Test2 {
  uint public num;
}`,
});