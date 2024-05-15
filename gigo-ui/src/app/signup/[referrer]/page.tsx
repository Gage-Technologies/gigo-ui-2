import dynamic from "next/dynamic";

const Signup = dynamic(() => import("@/components/Pages/Signup/Signup"), { ssr: false });

export default Signup;