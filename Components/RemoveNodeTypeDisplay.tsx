import { nodeTypesState, nodeTypesToRemoveState } from "@/State/atoms";
import { useRecoilState, useRecoilValue } from "recoil";

export function RemoveNodeTypeDisplay() {
  const nodeTypes = useRecoilValue(nodeTypesState);
  const [nodeTypesToRemove, setNodeTypesToRemove] = useRecoilState(
    nodeTypesToRemoveState
  );
  return (
    <>
      {Object.keys(nodeTypes).map((nodeType) => (
        <div className="flex flex-row" key={nodeType}>
          <input
            type="checkbox"
            checked={!nodeTypesToRemove?.includes(nodeType)}
            onChange={(e) => {
              if (!e.target.checked) {
                setNodeTypesToRemove([...(nodeTypesToRemove || []), nodeType]);
              } else {
                setNodeTypesToRemove(
                  nodeTypesToRemove?.filter((t) => t !== nodeType)
                );
              }
            }}
          />
          <label>{nodeType}</label>
        </div>
      ))}
    </>
  );
}
