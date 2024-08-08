'use client';
import { useSearchParams } from "next/navigation";
import ProfileMobile from "@/components/Profile/profileMobile";
import Profile from "@/components/Profile/profile";

function HandleProfile() {
    const query = useSearchParams();
    const isMobile = query.get("viewport") === "mobile";

    // decide which component to render based on the viewport
    if (isMobile) {
        // use the ProfileMobile component from profileMobile.tsx
        return <ProfileMobile />;
    }
    // use the Profile component for non-mobile viewports
    return <Profile />;
}

export default HandleProfile;
