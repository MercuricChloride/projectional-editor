import { selector } from 'recoil';
import { nodeState } from './atoms';

// export const edgeSelector = selector({
//   key: 'edgeState',
//   get: ({ get }) => {
//     const { nodes } = get(nodeState);
//     const edges = nodes
//       .filter((node: any) => node.id.includes('-')) // filter out the contract nodes
//       .map((node: any, index: number) => {
//         const split = node.id.split('-');
//         const parentId = split.slice(0, split.length - 1).join('-');
//         const sources = [parentId];
//         const targets = [node.id];
//         return {
//           id: index.toString(),
//           sources,
//           source: sources[0], // we have to set `source` because thats what react flow uses
//           targets,
//           target: targets[0], // we have to set `target` because thats what react flow uses
//         };
//       });
//     return edges;
//   }
// });