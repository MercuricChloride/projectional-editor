import { ElkExtendedEdge, ElkNode } from "elkjs";
import ELK from "elkjs/lib/elk.bundled.js";
import { Edge } from "reactflow";
import { DEFAULT_GRAPH_TYPE, INode } from "./types";
const elk = new ELK();


export async function formatNodes(nodes: INode[], inputEdges?: any[]): Promise<[INode[], Edge[]]> {
  const edges = !inputEdges
  ? nodes
  .filter((node: any) => node.id.includes('-')) // filter out the contract nodes
  .map((node: any, index: number) => {
    const split = node.id.split('-');
    const parentId = split.slice(0, split.length-1).join('-');
    const sources = [parentId]
    const targets = [node.id]
    return {
      id: index.toString(),
      sources,
      source: sources[0], // we have to set `source` because thats what react flow uses
      targets,
      target: targets[0], // we have to set `target` because thats what react flow uses
    };
  })
  : inputEdges;

  if(!edges) {
    throw new Error("No edges");
  }

  const graph: ElkNode = {
    id: "root",
    children: nodes,
    edges: edges as ElkExtendedEdge[],
    width: 10000,
    height: 10000,
  };

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
  
  return [nodesWithPosition, edges as Edge[]];
}