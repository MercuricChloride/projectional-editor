export function typeToSnippet(type: string): Function | undefined {
  switch (type) {
    case "function":
      return functionSnip;
    case "localVariable":
      return localVariableSnip;
    case "stateVariable":
      return stateVariableSnip;
    case "expression":
      return expressionSnip;
  }
}

// I am writing a snippet expander for use in a preprocessors,
// the idea is that you can write a snippet like this:
// A snippet should just be a function that takes arguments and returns a string.

// here is simple snippet example:
export function functionSnip(name = "foo", args = ["uint a", "uint b"], children = [""]): string {
  return `\
  function ${name}(${args.join(', ')}) public {
    ${
      children[0] === ""
      ? "// do something"
      : children.join('') 
    }
  }\n`;
}

export function localVariableSnip(name = "a", type = "uint", value = "0"): string {
  return `\
  ${type} ${name} = ${value};\n`;
}

export function stateVariableSnip(name = "a", type = "uint", visibility = "public", value = "0"): string {
  return `\
  ${type} ${visibility} ${name} = ${value};\n`;
}

export function expressionSnip(expression: string): string {
  return `\
  ${expression};
  `;
}