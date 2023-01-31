import dynamic from "next/dynamic";

export default dynamic(() => import("../Components/EditorInterface"), {
  ssr: false,
});
