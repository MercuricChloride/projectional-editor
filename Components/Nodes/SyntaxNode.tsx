import {
  addNodeDropdownState,
  editingNodeIdState,
  nodeDataState,
  shouldDisplayEditorState,
} from "@/State/atoms";
import { useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import { useRecoilState } from "recoil";

interface SyntaxNodeProps {
  id: string;
  style: string;
  children: any;
  data: any;
  subTypes: string[];
}

export function SyntaxNode({
  id,
  style,
  children,
  data,
  subTypes,
}: SyntaxNodeProps) {
  const [, setDisplayEditor] = useRecoilState(shouldDisplayEditorState);

  const [, setEditingNodeId] = useRecoilState(editingNodeIdState);

  const [nodeDropdown, setNodeDropdown] = useState(false);

  const { hasError } = data;

  return (
    <div
      className={hasError ? "bg-red-100" : style}
      onDoubleClick={() => {
        setEditingNodeId(id);
        setDisplayEditor(true);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setNodeDropdown(true);
      }}
      onMouseLeave={() => {
        setNodeDropdown(false);
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      {hasError && (
        <div className="text-center text-red-500">Error: {hasError}</div>
      )}
      {children}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
      {nodeDropdown && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md min-w-36">
          Add a node:
          {subTypes.map((subType) => (
            <button
              key={subType}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => {
                console.log("Should add a node of type: ", subType);
                setNodeDropdown(false);
              }}
            >
              {subType}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
