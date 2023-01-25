import { ContractDefinition, FunctionDefinition } from "@solidity-parser/parser/dist/src/ast-types";
import { ElkNode } from "elkjs";
import ELK from "elkjs/lib/elk.bundled.js";
const elk = new ELK();

// These are helper functions meant to play nice with the visitor pattern
// I use them to traverse the AST and extract the information I need
// I am going to keep things mainly functional, so everything should be pure and return a new array

const DEFAULT_NODE_WIDTH = 150;
const DEFAULT_NODE_HEIGHT = 150;
const DEFAULT_GRAPH_TYPE = "mrtree";

// I think that most of these functions should return an array of strings which will be the node labels for the generated graph
export interface INode {
  id: string;
  position: {
    x: number;
    y: number;
  };
  type?: string;
  data?: any;
  loc?: {
    start: {
      line: number;
      column: number;
    };
    end: {
      line: number;
      column: number;
    };
  };
  width?: number;
  height?: number;
}

export interface IVariable {
  name: string;
  visibility: string;
  typeName: {
    name: string;
  };
}

export interface ScopeRange {
  start: number;
  end: number;
  name: string;
}


export function defaultINode(): INode {
  return {
    id: "",
    position: { x: 0, y: 0 },
    width: DEFAULT_NODE_WIDTH,
    height: DEFAULT_NODE_HEIGHT,
  };
}


// inputs:
// contractNode: an object representing a contract node in the AST
// output: an INode object with no real position
export function handleContract(contractNode: ContractDefinition): INode {
  const {name, loc} = contractNode;
  return {
    id: generateId([name]),
    position: { x: 0, y: 0 },
    loc: loc,
    data: {
      label: generateId([name]),
    },
    type: "contract",
    width: DEFAULT_NODE_WIDTH,
    height: DEFAULT_NODE_HEIGHT,
  };
}

export function handleFunction(functionNode: FunctionDefinition): INode {
  const name = functionNode.name || "";
  return {
    id: generateId([name]),
    position: { x: 0, y: 0 },
    loc: functionNode.loc,
    data: {
      label: generateId([name]),
    },
    type: "function",
    width: DEFAULT_NODE_WIDTH,
    height: DEFAULT_NODE_HEIGHT,
  };
}

// @notice A function to define the ID for a node. This ID setup is to make it easy to define the scope of things when we position the nodes and draw the edges.
// @param scopeArr, an array of strings listing the scope from largest -> smallest
// @example: the scope of a local variable called test within a function called bar on a contract called Foo.
// ['Foo', 'bar', 'test']  -> 'Foo-bar-test'
export function generateId(scope: string[]) {
  if(scope.length < 1) {
    console.error(scope);
    throw new Error("Invalid scope length for generateId()");
  }

  return scope.reduce((acc, item, index) => {
    if(index === 0) {
      return item // this is for just contracts
    } else {
      return acc + "-" + item
    }
  }, '');
}
 

export function getScopeRange(range: any, name:string | null): ScopeRange {
  const [start, end] = range;
  if(name === null){
    console.log(range, name)
    throw new Error("Unnamed variable or function");
  }
  return {
      start,
      end,
      name,
    };
}

// @notice A function to get the scope of a node and store it in the ID. This is used to determine the scope of a node when we are positioning the nodes and drawing the edges.
export function getNodeId(ranges: ScopeRange[], target: number) {
  return ranges
  .filter((range: any) => {
    const { start, end } = range;
    return target >= start && target <= end;
  }) // Filter out all the non matching scopes, this should never be empty
  .map((range: any) => { return range.name }) // map the scope names
  .reduce((acc, item, index) => {
    if(index === 0) {
      return item // this is for just contracts
    } else {
      return acc + "-" + item
    }
  } , ''); // reduce the array to a string for the ID
}

export async function formatNodes(nodes: INode[]): Promise<[INode[], any[]]> {
  const edges = nodes
  .filter((node: any) => node.id.includes('-')) // filter out the contract nodes
  .map((node: any, index: number) => {
    const split = node.id.split('-');
    const parentId = split.slice(0, split.length-1).join('-');
    const sources = [parentId]
    const targets = [node.id]
    return {
      id: index.toString(),
      sources,
      source: sources[0],
      targets, // we are using the key targets because thats what react flow uses
      target: targets[0], // we are using the key target because thats what react flow uses
    };
  })

  const graph: ElkNode = {
    id: "root",
    children: nodes,
    edges: edges,
    width: 10000,
    height: 10000,
  };
  console.log('graph', graph);

  const layout = await elk.layout(graph, {
    layoutOptions: {
     'elk.algorithm': DEFAULT_GRAPH_TYPE,
    },
  });

  console.log('layout', layout);

  const nodesWithPosition = layout.children?.map((node: any) => {
    const { x, y } = node;
    const newNode = {
      ...node,
      position: { x, y },
    }
    return newNode;
  }) || [];
  console.log('nodesWithPosition', nodesWithPosition);
  
  return [nodesWithPosition, edges];
}