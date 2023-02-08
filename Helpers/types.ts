import Parser from "web-tree-sitter";

export const DEFAULT_NODE_WIDTH = 150;
export const DEFAULT_NODE_HEIGHT = 150;
export const DEFAULT_GRAPH_TYPE = "mrtree";

export interface INode {
  id: string;
  position: {
    x: number;
    y: number;
  };
  type: string;
  data: any;
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
  node?: Parser.SyntaxNode;
  width?: number;
  height?: number;
}

export interface ScopeRange {
  start: number;
  end: number;
  name: string;
}