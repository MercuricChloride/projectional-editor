import { editingNodeIdState, inputCodeState, shouldDisplayEditorState } from "@/State/atoms";
import { displayNodesSelector } from "@/State/selectors";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

export function useUpdateCode(id?: string) {
    const [editingNodeId, setEditingNodeId] = useRecoilState(editingNodeIdState);

    const [sourceCode, setSourceCode] = useRecoilState(inputCodeState);

    const [nodes] = useRecoilValue(displayNodesSelector);

    const nodeData = nodes.find((node) => node.id === id || editingNodeId)?.data;

    const updateCode = (code: string) => {
        // get the start and end points for the source code snippet we are editing
        const { end } = nodeData.range;

        // split the source code into an array
        const splitSource = sourceCode.split("");

        // splice the new code into the end of the code
        splitSource.splice(end - 1, 0, code);

        // join the array back into a string
        const newSourceCode = splitSource.join("");

        // update the source code state
        setSourceCode(newSourceCode);

        // reset the editing node id
        setEditingNodeId("");
    };

    return updateCode;
}
