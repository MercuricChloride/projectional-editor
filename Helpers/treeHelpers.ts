import { nodeModuleNameResolver } from "typescript";
import Parser, { Query } from "web-tree-sitter";
import { INode, ScopeRange } from "./helpers";

// This is a query to grab all of the relevant scopes of the contract.
export function contractGoodies(language: Parser.Language): Query {
  return language.query(`
    (contract_declaration) @contract
    (function_definition) @function
    (state_variable_declaration name: (identifier) @stateVariable)
    (variable_declaration name: (identifier) @localVariable)
  `);
}

type CaptureName = 
'contract' 
| 'function'
| 'stateVariable' 
| 'localVariable' 

// @note this is not the most performant way to do this, but it is readable and easy to understand
// @note this function checks if the name of the capture is a capture that has a scope associated with it
// @todo add support for inline block statements in functions
function isScopeName(name: CaptureName): boolean {
  return [ 
    'contract',
    'function',
  ].includes(name);
}

//@note the input list of captures should only be for a single contract so this should be fine so we won't have weird collisions or sorting issues or anything
//@note I am using flatmap because I want to filter out the non-scope names with type inference. Filter doesn't work with type inference.
export function captureToScopeRange(captures: Parser.QueryCapture[]): ScopeRange[] {
  return captures
  .flatMap((capture) => {
    const { name, node } = capture;

    if(isScopeName(name as CaptureName)) {
      const name = node.childForFieldName("name")?.text;
      const body = 
      node.childForFieldName("body")
      ?? node.childForFieldName("contract_body")
      
      console.log("NODE", node)
      console.log("NAME", name)
      console.log("BODY", body)

      if(body === null || !name) {
        console.error('No body or no name for ', node)
        return [];
      };

      return [{
        // start: body.startIndex,
        start: node.startIndex,
        // end: body.endIndex,
        end: node.endIndex,
        // name: capture.node.text
        name
        }];
    } else {
      return [];
    }
  });
}

function getCaptureDisplayLabel(capture: Parser.QueryCapture) {
  const { name, node } = capture;
  if(isScopeName(name as CaptureName)) {
    const nameNode = node.childForFieldName('name');
    if(!nameNode) {
      console.error('No name node for ', node)
      return '';
    }
    return nameNode.text;
  } else {
    return node.text;
  }
}

function getCaptureId(capture: Parser.QueryCapture, scopeRanges: ScopeRange[] ) {
  const { node } = capture;
  const { startIndex, endIndex } = node;

  const name = isScopeName(capture.name as CaptureName)
   ? node.childForFieldName('name')?.text 
   : node.text;

  const isNestedScope = (scope: ScopeRange) => {
    return scope.start <= startIndex && scope.end >= endIndex && scope.name !== name;
  }

  const prefix = scopeRanges.reduce((acc, scope) => {
    // we are iterating over the scopes to find all of the scopes that contain the capture
    if(isNestedScope(scope)) {
      return `${scope.name}-${acc}`
    } else {
      return acc;
    }
  }, '');

  return `${prefix}${name}`;
}


// this function should take in the goodies from the contractGoodies query
// and return an array of INodes
// This should be 
// @note I want to make this function return a flat data type so that it is more flexible
export function goodiesToINodes(goodies: Parser.QueryMatch, width: number, height: number, scopeRanges: ScopeRange[], sourceCode: string): INode[] {

  const {captures} = goodies;

  return captures.map((capture) => {
    const id = getCaptureId(capture, scopeRanges);
    const displayLabel = getCaptureDisplayLabel(capture);
    //@note probably need a better name for this. But this is the syntax node that we want to display in the code editor
    const codeNode = isScopeName(capture.name as CaptureName) ? capture.node.childForFieldName('body') : capture.node;
    return {
      id,
      type: capture.name,
      position: { x: 0, y: 0 },
      data: {
        label: displayLabel,
        code: codeNode?.text,
        range: {
          start: codeNode?.startIndex,
          end: codeNode?.endIndex,
        },
        visibility: '',
      },
      width,
      height,
    };
    //@todo check out the depth sizing later
    // depth is the number of scopes that the capture is nested in
    // const depth = id.split('-').length;
      // width: width / depth,
      // height: height / depth,
  })
}