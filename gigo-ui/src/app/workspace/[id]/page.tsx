import dynamic from "next/dynamic";

const Workspace = dynamic(() => import("@/components/WorkspaceAdvanced"), { ssr: false });

export default Workspace;