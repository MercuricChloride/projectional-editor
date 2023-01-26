import { useEffect, useState } from "react";
import Parser from "web-tree-sitter";

export default function ParserPage(props: any) {
  const [text, setText] = useState("");
  const [tree, setTree] = useState("");
  const [parser, setParser] = useState<any>();

  const init = async () => {
    await Parser.init({
      locateFile(scriptName: string, scriptDirectory: string) {
        return scriptName;
      },
    });
    const Solidity = await Parser.Language.load("tree-sitter-solidity.wasm");

    const parser = new Parser();
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
        console.log(tree.rootNode.toString());
      } catch (_) {}
    }
  }, [text, parser]);

  return (
    <div>
      <textarea onChange={(e) => setText(e.target.value)} />
    </div>
  );
}
