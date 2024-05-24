'use client';
import { useSearchParams } from "next/navigation";
import ByteMobile from "@/components/Bytes/byteMobile";
import BytePage from "@/components/Bytes/byte";
import { Byte } from "@/models/bytes";

interface ByteProps {
    params: {
        id: string
    },
    byte: Byte
}

function ByteViewportRouter({ params, byte }: ByteProps) {
    const query = useSearchParams();
    const isMobile = query.get("viewport") === "mobile";

    if (isMobile) {
        return <ByteMobile params={params} byte={byte} />;
    }
    return <BytePage params={params} byte={byte} />;
}

export default ByteViewportRouter;
