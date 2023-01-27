import dynamic from "next/dynamic";

export default dynamic(() => import("../Components/Nodes/editor"), {
  ssr: false,
});
