'use client';
import useIsMobile from "@/hooks/isMobile";
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
    const isMobile = useIsMobile();

    console.log("byte isMobile", isMobile)

    if (isMobile) {
        return <ByteMobile params={params} byte={byte} />;
    }
    return <BytePage params={params} byte={byte} />;
}

export default ByteViewportRouter;
