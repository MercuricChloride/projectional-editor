import { detailLevelState } from "@/State/atoms";
import { useRecoilState } from "recoil";

export function ChangeDetailButton() {
  const [detailLevel, setDetailLevel] = useRecoilState(detailLevelState);
  return (
    <div className="flex flex-col w-3/12 justify-around">
      <button
        className="bg-slate-400 rounded-full"
        onClick={() => {
          setDetailLevel(detailLevel + 1);
        }}
      >
        Increase Detail
      </button>
      Detail Level: {detailLevel}
      <button
        className="bg-slate-400 rounded-full"
        onClick={() => {
          setDetailLevel(detailLevel - 1);
        }}
      >
        Decrease Detail
      </button>
    </div>
  );
}
