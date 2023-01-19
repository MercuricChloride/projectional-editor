import dynamic from "next/dynamic";

export default dynamic(() => import("../Components/editor"), {
  ssr: false,
});
