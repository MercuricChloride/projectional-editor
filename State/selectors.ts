import { DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH, formatNodes, INode } from '@/Helpers/helpers';
import { captureToScopeRange, contractGoodies, goodiesToINodes } from '@/Helpers/treeHelpers';
import { Edge } from 'reactflow';
import { selector } from 'recoil';
import { detailLevelState, edgeState, inputCodeState, nodeState, nodeTypesToRemoveState, parserState } from './atoms';

export const parsedTreeSelector = selector({
  key: 'parsedTree',
  get: ({ get }) => {
    const parser = get(parserState);
    const code = get(inputCodeState);
    if(!parser) return undefined;

    const tree = parser.parse(code);

    return tree;
  }
});

export const displayNodesSelector = selector<[INode[], Edge[]]>({
  key: 'displayNodes',
  get: async ({ get }) => {
    const nodeTypesToRemove = get(nodeTypesToRemoveState);
    const oldNodes = get(nodeState);
    const oldEdges = get(edgeState);
    const detailLevel = get(detailLevelState);
    const parsedTree = get(parsedTreeSelector);
    const code = get(inputCodeState);
    if(!parsedTree) return [[], []];

    if(parsedTree.rootNode.hasError()) {
      console.log("Syntax Error")
      return [oldNodes, oldEdges]
    }


    const language = parsedTree.getLanguage();

    //@todo refactor and change the name of this to something more descriptive
    // these are all of the contract matches
    const goodies = contractGoodies(language).matches(parsedTree.rootNode);

    // get the scope range for each match that has a scope
    const scopeRange = goodies.flatMap((goodie) => {
      return captureToScopeRange(goodie.captures);
    });

    // sort by start position
    scopeRange.sort((a, b) => a.start - b.end);

    // map over the matches and create INode objects for each
    const rawNodes = goodies.flatMap((goodie) => {
      return goodiesToINodes(
        goodie,
        DEFAULT_NODE_HEIGHT,
        DEFAULT_NODE_WIDTH,
        scopeRange,
        code
      );
    });

    return await formatNodes(
      rawNodes.filter(
        (node) =>
          node.id.split("-").length <= detailLevel &&
          !nodeTypesToRemove.includes(node.type)
      )
    );
  }
});