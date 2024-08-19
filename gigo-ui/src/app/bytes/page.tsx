'use client';
import useIsMobile from "@/hooks/isMobile";
import AllBytesScrollMobile from "@/components/allBytesScrollMobile";
import AllBytesScroll from "@/components/allBytesScroll";

function HandleByte({ params }: { params: { id: string } }) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return <AllBytesScrollMobile />;
    }
    return <AllBytesScroll />;
}

export default HandleByte;
