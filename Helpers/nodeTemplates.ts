import { SyntaxNode } from "web-tree-sitter";

// export function syntaxNodeToSourceCode(node: SyntaxNode): string {)
// }

export function defaultNodeName(node: SyntaxNode): string {
  switch(node.type) {
    case 'contract_definition':
      return 'DefaultContract';
    case 'function_definition':
      return 'defaultFunction';
    case 'variable_declaration':
      return 'defaultVariable';
    default:
      return 'defaultName';
  }
}

export function contractToSourceCode(node: SyntaxNode): string {
  const contractName = node.childForFieldName('name')?.text || defaultNodeName(node);
  const contractBody = node.childForFieldName('body')?.text;

  return `\
  contract ${contractName} {
    ${contractBody}
  }`;
}

export function functionToSourceCode(node: SyntaxNode): string {
  const functionName = node.childForFieldName('name')?.text;
  const functionBody = node.childForFieldName('body')?.text;
  const visibility = node.childForFieldName('visibility')?.text;
  const stateMutability = node.childForFieldName('state_mutability')?.text;

  const return_type = node.childForFieldName('return_type')?.text;
  const returns = return_type ? `returns (${return_type})` : '';

  const modifiers = [
    visibility,
    stateMutability,
    returns,
  ].reduce((acc, curr) => {
    if (curr) {
      return acc + ' ' + curr;
    } else {
      return acc;
    }
  }, '')

  const parameters = node.children
  .filter(child => child.type === 'parameter')
  .map(parameter => parameter.text).join(', ');

  return `\
  function ${functionName}(${parameters}) ${modifiers} {
    ${functionBody}
  }`;

}