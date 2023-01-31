import { ContractNode } from "@/Components/Nodes/ContractNode";
import { FunctionNode } from "@/Components/Nodes/FunctionNode";
import { LocalVariableNode } from "@/Components/Nodes/LocalVariableNode";
import { StateVariableNode } from "@/Components/Nodes/StateVariableNode";
import { INode } from "@/Helpers/helpers";
import { atom } from "recoil";
import Parser from "web-tree-sitter";
import { Edge } from "reactflow";

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

export const parser = atom({
  key: 'parser',
  default: async() => {
    await Parser.init({
      locateFile(scriptName: string, scriptDirectory: string) {
        return scriptName;
      },
    });
    const Solidity = await Parser.Language.load("tree-sitter-solidity.wasm");

    const parser = new Parser();

    parser.setLanguage(Solidity);
    return parser;
  }
});
