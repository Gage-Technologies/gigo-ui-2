'use client';
import { useSearchParams } from "next/navigation";
import UserPage from "@/components/User/user";
import UserPageMobile from "@/components/User/userMobile";

function HandleUserPage({ params }: { params: { id: string } }) {
    const query = useSearchParams();
    const isMobile = query.get("viewport") === "mobile";

    // decide which component to render based on the viewport
    if (isMobile) {
        // use the UserMobile component for mobile viewports
        return <UserPageMobile params={params} />;
    }
    // use the User component for non-mobile viewports
    return <UserPage params={params} />;
}

export default HandleUserPage;
