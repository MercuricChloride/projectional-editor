import Parser, { Query } from "web-tree-sitter";
import { ElkNode } from "elkjs";
import { INode, ScopeRange } from "./helpers";

// This is a query to grab all of the relevant scopes of the contract.
export function contractGoodies(language: Parser.Language): Query {
  return language.query(`
    (contract_declaration name: (identifier) @contract_name)
    (function_definition name: (identifier) @function_name)
    (state_variable_declaration name: (identifier) @state_variable)
    (variable_declaration name: (identifier) @local_variable)
  `);
}

// this is a query to grab everything. It's just here for reference for now.
const moreGoodies = `
(contract_declaration
  name: (identifier) @contract_name
  body: (contract_body
          ;; capture functions
          (function_definition
            function_name: (identifier)* @function_name
            body: (function_body
                    (expression_statement
                      ;;capture variable assignments
                      (assignment_expression)* @variable_assignment)
                    )* @function_body)*

          ;; capture state variables
          ;; note the * at the end of the s-exp, we don't want to restrict our parsing to contracts that don't contain somenthing
          (state_variable_declaration
            name: (identifier) @variable_name)*
          ))`




// @note this is not the most performant way to do this, but it is readable and easy to understand
// @todo add support for inline block statements in functions
function isScopeName(name: string): boolean {
  return [ 
    'contract_name',
    'function_name',
  ].includes(name);
}

//@note the input list of captures should only be for a single contract so this should be fine so we won't have weird collisions or sorting issues or anything
//@note why am I using flatmap? because I want to filter out the non-scope names
export function captureToScopeRange(captures: Parser.QueryCapture[]): ScopeRange[] {
  return captures
  .flatMap((capture) => {
    const { name, node } = capture;
    // if it is a scope name, we want to get the body of the contract or function or whatever
    if(isScopeName(name)) {
      let body = node.nextNamedSibling;
      // since we are operating on the name, we need to walk along the named siblings until we find a body
      while (!body?.type.includes("_body")) {
        if(!body) {
          console.error('no body found for: ', node.text)
          return [];
        }
        body = body.nextNamedSibling
      }

      return [{
        start: body.startIndex,
        end: body.endIndex,
        name: capture.node.text
        }];
    } else {
      return [];
    }
  });
}


function getCaptureId(capture: Parser.QueryCapture, scopeRanges: ScopeRange[] ) {
  const { node } = capture;
  const { startIndex, endIndex } = node;
  const prefix = scopeRanges.reduce((acc, scope) => {
    // we are iterating over the scopes to find all of the scopes that contain the capture
    if(scope.start <= startIndex && scope.end >= endIndex) {
      return `${scope.name}-${acc}`
    } else {
      return acc;
    }
  }, '');

  return `${prefix}${node.text}`;
}

type CaptureType = 
'contract' 
| 'function'
| 'stateVariable' 
| 'localVariable' 

function getCaptureType(capture: Parser.QueryCapture): CaptureType | 'unknown' {
  switch(capture.name) {
    case "contract_name":
      return "contract";
    case "state_variable":
      return "stateVariable"
    case "local_variable":
      return "localVariable";
    case "function_name":
      return "function";
    default:
      return "unknown";
  }
}

// this function should take in the goodies from the contractGoodies query
// and return an array of INodes
// This should be 
// @note I want to make this function return a flat data type so that it is more flexible
export function goodiesToINodes(goodies: Parser.QueryMatch, width: number, height: number, scopeRanges: ScopeRange[]): INode[] {

  const {captures} = goodies;
  
  // captures.sort((a, b) => a.node.startIndex - b.node.startIndex);

  // const scopeRanges = captureToScopeRange(captures);

  return captures.map((capture) => {
    const id = getCaptureId(capture, scopeRanges);
    // depth is the number of scopes that the capture is nested in
    // const depth = id.split('-').length;
    const type = getCaptureType(capture);
    return {
      id,
      type,
      position: { x: 0, y: 0 },
      data: {
        label: capture.node.text,
        visibility: '',
      },
      width,
      height,
      // width: width / depth,
      // height: height / depth,
    };
  })
}

// THESE ARE THE OLD FUNCTIONS THAT I'M KEEPING AROUND FOR REFERENCE
//--------------------------------------------------------------

export function goodiesToElkNode(goodies: Parser.QueryMatch, width: number, height: number): ElkNode {
  const captures = goodies.captures.reduce((acc, capture) => {
    if(acc[capture.name]){
      acc[capture.name].push(capture)
    } else {
      acc[capture.name] = [capture]
    }
    return acc;
  }, {} as { [key: string]: Parser.QueryCapture[] })

  const contractName = captures.contract_name[0].node.text;

  const contractNode = {
    id: contractName,
    labels: [{ text: contractName }],
    children:<ElkNode[]> [],
    width,
    height,
  };

  captures.state_variable.forEach((variable) => {
    contractNode.children.push({
      id: `${contractName}-${variable.node.text}`,
      labels: [{ text: variable.node.text }],
      width,
      height,
    });
  });

 captures.function_name.forEach((func) => {
    contractNode.children.push({
      id: `${contractName}-${func.node.text}`,
      labels: [{ text: func.node.text }],
      width,
      height,
    });
  });

  return contractNode;
}