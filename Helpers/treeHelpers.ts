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


// this function should take in the goodies from the contractGoodies query
// and return an array of INodes
// This should be 
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
      visibility
    }
    return {
      id,
      type: capture.name,
      position: { x: 0, y: 0 },
      width,
      data,
      height,
    };
  })
}

export function simpleDisplay(node: Parser.SyntaxNode, depth: number = 0): INode[] {
  const nodes = [];

  const id = node.id.toString();
  const data = {
    label: node.text,
    code: node.text,
    range: {
      start: node.startIndex,
      end: node.endIndex,
    },
    visibility: '',
  }
  nodes.push({
    id,
    type: node.type,
    position: { x: 0, y: 0 },
    width: 100,
    data,
    height: 100,
    node,
    depth
  });

  node.namedChildren.forEach((child) => {
    nodes.push(...simpleDisplay(child, depth + 1));
  })

  nodes.sort((a, b) => a.depth - b.depth);

  return nodes;
}

interface IEdge {
  id: string;
  source: string;
  target: string;
  sources: string[];
  targets: string[];
}

export function simpleEdges(nodes: INode[]): IEdge[] {
  const edges: any[] = [];
  
  nodes.forEach((node) => {
    const { node: syntaxNode } = node;
    if(!syntaxNode) return;
    const parent = syntaxNode.parent;
    if(parent) {
      const sources = [parent.id.toString()];
      const targets = [node.id.toString()]
      edges.push({
        id: `${parent.id}-${node.id}`,
        sources,
        source: sources[0],
        targets,
        target: targets[0], // we have to set `target` because thats what react flow uses
      })
    }
  })

  return edges;
}

export async function formatNodes(nodes: INode[]) {
  const edges = simpleEdges(nodes);
  const graph: ElkNode = {
    id: 'root',
    children: nodes,
    edges,
    width: 10000,
    height: 10000,
  }

  const layout = await elk.layout(graph, {
    layoutOptions: {
     'elk.algorithm': DEFAULT_GRAPH_TYPE,
    },
  });

  const nodesWithPosition = layout.children?.map((node: any) => {
    const { x, y } = node;
    const newNode = {
      ...node,
      position: { x, y },
    }
    return newNode;
  }) || [];

  return [nodesWithPosition.slice(4), edges];
}