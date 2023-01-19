// These are helper functions meant to play nice with the visitor pattern
// I use them to traverse the AST and extract the information I need
// I am going to keep things mainly functional, so everything should be pure and return a new array

// I think that most of these functions should return an array of strings which will be the node labels for the generated graph

interface INode {
  id: string,
  data: any,
  position: {
    x: number,
    y: number
  },
  loc: {
    start: {
      line: number,
      column: number
    }
    end: {
      line: number,
      column: number
    }
  }
}

// inputs:
// contractNode: an object representing a contract node in the AST
// output: an INode object with no real position
export function getContract(contractNode: any): INode {
  return {
    id: generateId(contractNode.name),
    position: {x: 0, y: 0},
    loc: contractNode.loc,
    data: {
      label: generateId(contractNode.name),
    }
  }
}

// inputs:
// contractNode: an object representing a contract node in the AST
// output: an array of INode objects with no real position
export function getStateVariables(contractNode: any): INode[] {
  const contractName = contractNode.name;

  return contractNode.subNodes
    .filter((subNode: any) => subNode.type === "StateVariableDeclaration")
    .flatMap(({variables}: any) => variables.map((variable: any) => {
      console.log(variable)
      return {
        id: generateId(contractName, variable),
        position: {x: 0, y: 0},
        loc: variable.loc,
        data: {
          label: displayVariable(variable),
        }
      }
    }));
}

// inputs:
// nodes: an array of INodes
// x: a function that returns a number
// y: a function that returns a number
// output: an array of INode objects
export function positionNodes(nodes: INode[], x :number, y: (index: number) => number): INode[] {
  return nodes.map((node: INode, index) => ({
    ...node,
    position: {x, y: y(index)},
  }))
}

interface IVariable {
  name: string,
  visibility: string,
  typeName: {
    name: string
  },
}

export function displayVariable(variable: IVariable) {
  console.log(variable)
  const {name, visibility, typeName: {name: type}} = variable;
  return `${visibility} ${type}:
   ${name}`
}

// the only thing that shouldn't have a type is a contract
export function generateId(contractName: string, variable?: IVariable) {
  if (!variable) return contractName;
  const {name, typeName: {name: type}} = variable;
  if(!name || !type) console.error("variable is missing a name or type", variable);
  return `${contractName}-${type}-${name}`;
}