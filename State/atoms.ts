import { ContractNode } from "@/Components/Nodes/ContractNode";
import { FunctionNode } from "@/Components/Nodes/FunctionNode";
import { LocalVariableNode } from "@/Components/Nodes/LocalVariableNode";
import { StateVariableNode } from "@/Components/Nodes/StateVariableNode";
import { atom, atomFamily } from "recoil";
import { Edge } from "reactflow";
import Parser from "web-tree-sitter";
import { INode } from "@/Helpers/types";

export const fullScreenState = atom({
  key: 'fullScreenState',
  default: false,
});

export const nodeState = atom<INode[]>({
  key: 'nodeState',
  default: [],
});

export const edgeState = atom<Edge[]>({
  key: 'edgeState',
  default: [],
});

//@note - this is a map of node id to node data
// this makes our lives easier when we want to update a node or fetch it's data
//@param - key: node id
export const nodeDataState = atomFamily<any, string>({
  key: 'nodeData',
  default: {},
});

export const editingNodeIdState = atom<string>({
  key: 'editingNodeId',
  default: '',
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
}`,
});

export const shouldDisplayEditorState = atom({
  key: 'shouldDisplayEditor',
  default: false,
});
