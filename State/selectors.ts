import { formatNodes } from '@/Helpers/elkHelpers';
import { capturesToScopeRange, contractGoodies, capturesToNodes } from '@/Helpers/treeHelpers';
import { DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH, INode } from '@/Helpers/types';
import { Edge } from 'reactflow';
import { selector } from 'recoil';
import { detailLevelState, inputCodeState, nodeTypesToRemoveState, parserState } from './atoms';

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
    const detailLevel = get(detailLevelState);
    const parsedTree = get(parsedTreeSelector);
    if(!parsedTree) return [[], []];

    if(parsedTree.rootNode.hasError()) {
      console.log("Syntax Error")
      return [[], []];
    }

    const language = parsedTree.getLanguage();

    // these are all of the contract matches
    const matches = contractGoodies(language).matches(parsedTree.rootNode);

    // get the scope range for each match that has a scope
    const scopeRange = matches.flatMap(({captures}) => {
      return capturesToScopeRange(captures);
    })

    // sort by start position
    scopeRange.sort((a, b) => a.start - b.end);

    // map over the matches and create INode objects for each
    const rawNodes = matches.flatMap(({captures}) => {
      return capturesToNodes(
        captures,
        DEFAULT_NODE_HEIGHT,
        DEFAULT_NODE_WIDTH,
        scopeRange,
      );
    });

    const filteredNodes = rawNodes.filter((node) =>
          node.id.split("-").length <= detailLevel &&
          !nodeTypesToRemove.includes(node.type));

    return await formatNodes(filteredNodes);
  }
});