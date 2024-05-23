'use client';
import { useSearchParams } from "next/navigation";
import ByteMobile from "@/components/Bytes/byteMobile";
import Byte from "@/components/Bytes/byte";
import AllBytesScrollMobile from "@/components/allBytesScrollMobile";
import AllBytesScroll from "@/components/allBytesScroll";

function HandleByte({ params }: { params: { id: string } }) {
    const query = useSearchParams();
    const isMobile = query.get("viewport") === "mobile";

    if (isMobile) {
        return <AllBytesScrollMobile />;
    }
    return <AllBytesScroll />;
}

export default HandleByte;
