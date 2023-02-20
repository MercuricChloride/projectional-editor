import Parser, { Query } from "web-tree-sitter";
import { DEFAULT_GRAPH_TYPE, INode, ScopeRange } from "./types";
import Elk, { ElkNode } from "elkjs/lib/elk.bundled.js";
const elk = new Elk();

// This is a query to grab all of the relevant scopes of the contract.
export function contractGoodies(language: Parser.Language): Query {
  return language.query(`
    (contract_declaration) @contract
    (function_definition) @function
    (state_variable_declaration) @stateVariable
    (variable_declaration) @localVariable
    ;(function_body) @functionBody
  `);
}

export function capturesToScopeRange(captures: Parser.QueryCapture[]): ScopeRange[] {
  return captures
  .map((capture) => {
    const { node } = capture;

      const name = node.childForFieldName("name")?.text;
      if(!name) return null;

      return {
        start: node.startIndex,
        end: node.endIndex,
        name
        };
  })
  .filter((x) => x !== null) as ScopeRange[];
}

function getCaptureId(capture: Parser.QueryCapture, scopeRanges: ScopeRange[] ) {
  const { node } = capture;
  const { startIndex, endIndex } = node;

  const name = node.childForFieldName('name')?.text;
  if(!name) return '';

  const isNestedScope = (scope: ScopeRange) => {
    return scope.start <= startIndex && scope.end >= endIndex && scope.name !== name;
  }

  const prefix = scopeRanges.reduce((acc, scope) => {
    if(isNestedScope(scope)) {
      return `${scope.name}-${acc}`
    } else {
      return acc;
    }
  }, '');


  const id = `${prefix}${name}`;
  return id;
}


// @note I want to make this function return a flat data type so that it is more flexible
//@todo Add depth sizing?
export function capturesToNodes(captures: Parser.QueryCapture[], width: number, height: number, scopeRanges: ScopeRange[]): INode[] {

  return captures.map((capture) => {
    const id = getCaptureId(capture, scopeRanges);
    const {node} = capture;
    const {text: code, startIndex, endIndex} = node;

    const label = node.childForFieldName('name')?.text ?? capture.node.text;
    const visibility = node.childForFieldName('visibility')?.text ?? '';

    const data = {
      label,
      code,
      range: {
        start: startIndex,
        end: endIndex
      },
      node,
      hasError: node.hasError(),
      visibility
    }
    return {
      id,
      type: capture.name,
      position: { x: 0, y: 0 },
      width,
      height,
      data,
    };
  })
}