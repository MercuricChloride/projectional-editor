import { selector } from 'recoil';
import { inputCodeState, parserState } from './atoms';

export const parsedTreeSelector = selector({
  key: 'parsedTree',
  get: ({ get }) => {
    const parser = get(parserState);
    const code = get(inputCodeState);
    if(!parser) return undefined;

    return parser.parse(code);
  }
});