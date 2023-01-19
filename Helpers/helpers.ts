import { ElkNode } from "elkjs";
import ELK from "elkjs/lib/elk.bundled.js";
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

const DEFAULT_NODE_WIDTH = 300;
const DEFAULT_NODE_HEIGHT = 200;
const DEFAULT_GRAPH_TYPE = "mrtree";

// inputs:
// contractNode: an object representing a contract node in the AST
// output: an INode object with no real position
export function getContract(contractNode: any): INode {
  return {
    id: generateId(contractNode.name),
    position: { x: 0, y: 0 },
    loc: contractNode.loc,
    data: {
      label: generateId(contractNode.name),
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
        return {
          id: generateId(contractName, variable),
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
    return {
      id: index.toString(),
      sources: [contractName],
      targets: [node.id],
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
     'elk.algorithm': 'mrtree',
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

interface IVariable {
  name: string;
  visibility: string;
  typeName: {
    name: string;
  };
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

// the only thing that shouldn't have a type is a contract
export function generateId(contractName: string, variable?: IVariable) {
  if (!variable) return contractName;
  const {
    name,
    typeName: { name: type },
  } = variable;
  if (!name || !type)
    console.error("variable is missing a name or type", variable);
  return `${contractName}-${type}-${name}`;
}
