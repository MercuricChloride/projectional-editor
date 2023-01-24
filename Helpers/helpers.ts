import { ElkNode } from "elkjs";
import ELK from "elkjs/lib/elk.bundled.js";
import { ASTNodeTypeString, ContractDefinition } from "solidity-parser-diligence";
const elk = new ELK();

// These are helper functions meant to play nice with the visitor pattern
// I use them to traverse the AST and extract the information I need
// I am going to keep things mainly functional, so everything should be pure and return a new array

// I think that most of these functions should return an array of strings which will be the node labels for the generated graph
export interface INode {
  id: string;
  data: any;
  position: {
    x: number;
    y: number;
  };
  loc: {
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

interface IVariable {
  name: string;
  visibility: string;
  typeName: {
    name: string;
  };
}

const DEFAULT_NODE_WIDTH = 300;
const DEFAULT_NODE_HEIGHT = 200;
const DEFAULT_GRAPH_TYPE = "mrtree";


// Maybe we should just create a function which returns the correct object to be passed into the visitor that already operates on the correct types

// @param type
// This function is going to be used when we are iterating over the AST and extract information from the nodes
// The benefit for this approach is that it hides the complexity of traversing the AST and extracting information. Because we just call a single function for every node in the AST
export function contractToType(type: ASTNodeTypeString, contractNode: ContractDefinition): INode[] {
  const contractName = contractNode.name

  switch(type) {
    case "FunctionDefinition":
      return contractNode.subNodes
        .filter((subNode: any) => subNode.type === "FunctionDefinition")
        .flatMap(({ variables }: any) =>
          variables.map((variable: any) => {
            return {
              id: generateId([contractName, variable]),
              position: { x: 0, y: 0 },
              loc: variable.loc,
              data: {
                label: displayVariable(variable),
              },
              width: DEFAULT_NODE_WIDTH /2,
              height: DEFAULT_NODE_HEIGHT /2 ,
            };
          })
        );

    case "StateVariableDeclaration":
      return contractNode.subNodes
        .filter((subNode: any) => subNode.type === "StateVariableDeclaration")
        .flatMap(({ variables }: any) =>
          variables.map((variable: any) => {
            return {
              id: generateId([contractName, variable]),
              position: { x: 0, y: 0 },
              loc: variable.loc,
              data: {
                label: displayVariable(variable),
              },
              width: DEFAULT_NODE_WIDTH /2,
              height: DEFAULT_NODE_HEIGHT /2 ,
            };
          })
        );

    default:
      console.error("Invalid type");
      return [] as INode[];
  }
}

// inputs:
// contractNode: an object representing a contract node in the AST
// output: an INode object with no real position
export function getContract(contractNode: any): INode {
  return {
    id: generateId([contractNode.name]),
    position: { x: 0, y: 0 },
    loc: contractNode.loc,
    data: {
      label: generateId([contractNode.name]),
    },
    width: DEFAULT_NODE_WIDTH,
    height: DEFAULT_NODE_HEIGHT,
  };
}

// inputs:
// contractNode: an object representing a contract node in the AST
// output: an array of INode objects with no real position
export function getStateVariables(contractNode: any): INode[] {
  const contractName = contractNode.name;

  return contractNode.subNodes
    .filter((subNode: any) => subNode.type === "StateVariableDeclaration")
    .flatMap(({ variables }: any) =>
      variables.map((variable: any) => {
        console.log('variable', variable);
        return {
          id: generateId([contractName, variable]),
          position: { x: 0, y: 0 },
          loc: variable.loc,
          data: {
            label: displayVariable(variable),
          },
          width: DEFAULT_NODE_WIDTH /2,
          height: DEFAULT_NODE_HEIGHT /2 ,
        };
      })
    );
}

// export function codeBlockToLocalVariables(block: Block): INode[] {
//   return block.statements.filter((item) => item.type === "VariableDeclarationStatement")
//   .map((variable) => {

//   })
// }
export function getFunctionDeclarations(contractNode: any): INode[] {
  const contractName = contractNode.name;

  return contractNode.subNodes
    .filter((subNode: any) => subNode.type === "FunctionDefinition")
    .flatMap(({ variables }: any) =>
      variables.map((variable: any) => {
        return {
          id: generateId([contractName, variable]),
          position: { x: 0, y: 0 },
          loc: variable.loc,
          data: {
            label: displayVariable(variable),
          },
          width: DEFAULT_NODE_WIDTH /2,
          height: DEFAULT_NODE_HEIGHT /2 ,
        };
      })
    );
}

// inputs:
// nodes: an array of INodes
// x: a function that returns a number
// y: a function that returns a number
// output: an array [INode[], edges[]]
export async function positionNodes(nodes: INode[]): Promise<[INode[], any[]]> {
  //@dev ElkJS requires a root node, so that's why we are following this pattern of creating a root node and adding the other nodes as children
  // @dev Also ElkJS will not layout things correctly unless you make edges defined
  const flat = nodes.flat();

  const edges = flat
  .filter((node: any) => node.id.includes('-')) // filter out the contract nodes
  .map((node: any, index: number) => {
    const contractName = node.id.split('-')[0];
    const sources = [contractName]
    const targets = [node.id]
    return {
      id: index.toString(),
      sources: [contractName],
      source: contractName,
      targets: [node.id], // we are using the key targets because thats what react flow uses
      target: node.id, // we are using the key target because thats what react flow uses
    };
  });

  const graph: ElkNode = {
    id: "root",
    children: flat,
    edges: edges,
    width: 10000,
    height: 10000,
  };

  console.log('graph',graph)

  const layout = await elk.layout(graph, {
    layoutOptions: {
     'elk.algorithm': DEFAULT_GRAPH_TYPE,
    },
  });

  const nodesWithPosition = layout.children?.map((node: any) => {
    const { x, y } = node;
    console.log('position node',node)
    const newNode = {
      ...node,
      position: { x, y },
    }
    console.log('newNode',newNode)
    return newNode;
  }) || [];

  const outputEdges = layout.edges?.map((edge: any) => {
    const { id, sources, targets } = edge;
    return {
      id,
      source: sources[0],
      target: targets[0],
    };
  }) || [];

  return [nodesWithPosition, outputEdges];
}

export function displayVariable(variable: IVariable) {
  const {
    name,
    visibility,
    typeName: { name: type },
  } = variable;
  return `${visibility} ${type}:
   ${name}`;
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
 
export interface ScopeRange {
  start: number;
  end: number;
  name: string;
}

export function getScopeRange(range: any, name:string | null): ScopeRange {
  const [start, end] = range;
  if(name === null) throw new Error("Unnamed variable or function");
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
  }) // Filter out all the non matching scopes this should never be empty
  .map((range: any) => { return range.name }) // map the scope names
  .reduce((acc, item, index) => {
    if(index === 0) {
      return item // this is for just contracts
    } else {
      return acc + "-" + item
    }
  } , ''); // reduce the array to a string for the ID
}