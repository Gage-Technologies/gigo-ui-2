import type { Metadata } from 'next'
import User from "@/models/user";
import config from "@/config";
import JsonLd from '@/components/JsonLD';
import UserPage from "@/components/User/user";
import UserPageMobile from "@/components/User/userMobile";

export async function generateMetadata(
    { params }: { params: { id: string } }
): Promise<Metadata> {
    const user = await fetchUser(params.id);

    if (!user) {
        return {
            title: 'User Not Found - GIGO Dev',
            description: 'This user profile could not be found on GIGO Dev.',
        };
    }

    return {
        title: `${user.user_name}'s Profile - GIGO Dev`,
        description: `Check out ${user.user_name}'s profile on GIGO Dev. View their projects, contributions, and coding journey.`,
        openGraph: {
            title: `${user.user_name}'s Profile - GIGO Dev`,
            description: `Check out ${user.user_name}'s profile on GIGO Dev. View their projects, contributions, and coding journey.`,
            url: `https://gigo.dev/user/${params.id}`,
            siteName: 'GIGO Dev',
            images: [
                {
                    url: `${config.rootPath}/static/user/pfp/${user._id}`,
                    width: 200,
                    height: 200,
                    alt: `${user.user_name}'s profile picture`,
                },
            ],
            type: 'profile',
        },
        twitter: {
            card: 'summary',
            title: `${user.user_name}'s Profile - GIGO Dev`,
            description: `Check out ${user.user_name}'s profile on GIGO Dev. View their projects, contributions, and coding journey.`,
            images: [`${config.rootPath}/static/user/pfp/${user._id}`],
        },
    };
}

async function fetchUser(id: string): Promise<User | null> {
    try {
        const response = await fetch(`${config.rootPath}/api/user/profilePage`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ author_id: id }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error('Failed to fetch user data');
        }

        const responseData = await response.json();
        const userData: User = responseData.user;
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

export default async function HandleUserPage({ params, searchParams }: { params: { id: string }, searchParams: { viewport?: string } }) {
    const isMobile = searchParams.viewport === "mobile";
    const user = await fetchUser(params.id);

    if (!user) {
        return <div>User not found</div>;
    }

    const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": user.user_name,
        "url": `https://gigo.dev/user/${params.id}`,
        "image": `${config.rootPath}/static/user/pfp/${user._id}`,
        "description": `${user.user_name}'s profile on GIGO Dev`
    };

    return (
        <>
            <JsonLd data={jsonLdData} />
            {isMobile ? (
                <UserPageMobile params={params} />
            ) : (
                <UserPage params={params} />
            )}
        </>
    );
}