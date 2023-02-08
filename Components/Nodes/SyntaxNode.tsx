import { editingNodeIdState, shouldDisplayEditorState } from "@/State/atoms";
import { Handle, Position } from "reactflow";
import { useRecoilState } from "recoil";

export function SyntaxNode({ id, style, children }: any) {
  const [, setDisplayEditor] = useRecoilState(shouldDisplayEditorState);

  const [, setEditingNodeId] = useRecoilState(editingNodeIdState);

  return (
    <div
      className={style}
      onDoubleClick={() => {
        setEditingNodeId(id);
        setDisplayEditor(true);
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      {children}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
    </div>
  );
}
