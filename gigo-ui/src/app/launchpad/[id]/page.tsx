import dynamic from "next/dynamic";

const Launchpad = dynamic(() => import("@/components/Workspace"), { ssr: false });

export default Launchpad;