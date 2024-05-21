'use client';
import { useSearchParams } from "next/navigation";
import ByteMobile from "@/components/Bytes/byteMobile";
import Byte from "@/components/Bytes/byte";

function HandleByte({ params }: { params: { id: string } }) {
    const query = useSearchParams();
    const isMobile = query.get("viewport") === "mobile";

    if (isMobile) {
        return <ByteMobile params={params} />;
    }
    return <Byte params={params} />;
}

export default HandleByte;
