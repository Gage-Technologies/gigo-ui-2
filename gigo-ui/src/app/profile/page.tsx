'use client';
import ProfileMobile from "@/components/Profile/profileMobile";
import Profile from "@/components/Profile/profile";
import useIsMobile from "@/hooks/isMobile";

function HandleProfile() {
    const isMobile = useIsMobile();

    // decide which component to render based on the viewport
    if (isMobile) {
        // use the ProfileMobile component from profileMobile.tsx
        return <ProfileMobile />;
    }
    // use the Profile component for non-mobile viewports
    return <Profile />;
}

export default HandleProfile;
