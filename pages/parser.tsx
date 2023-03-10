import { useEffect, useState } from "react";
import Parser from "web-tree-sitter";

export default function ParserPage(props: any) {
  const [text, setText] = useState(`\
  contract Test {
    uint public num;
    }`);
  const [tree, setTree] = useState("");
  const [parser, setParser] = useState<Parser>();

  const init = async () => {
    await Parser.init({
      locateFile(scriptName: string, scriptDirectory: string) {
        return scriptName;
      },
    });
    const Solidity = await Parser.Language.load("tree-sitter-solidity.wasm");
    console.log("Solidity: ", Solidity);

    const parser = new Parser();
    console.log("parser: ", parser);
    parser.setLanguage(Solidity);
    setParser(parser);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (parser) {
      try {
        console.log(text);
        const tree = parser.parse(text);
        setTree(tree.rootNode.toString());
      } catch (_) {}
    }
  }, [text]);

  return (
    <div className="h-screen w-screen">
      <textarea
        className="h-full w-full"
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
