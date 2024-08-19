import type { Metadata } from 'next'
import User from "@/models/user";
import config from "@/config";
import JsonLd from '@/components/JsonLD';
import UserPage from "@/components/User/user";
import UserPageMobile from "@/components/User/userMobile";
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

export async function generateMetadata(
    { params }: { params: { id: string } }
): Promise<Metadata> {
    const user = await fetchUser(params.id);

    if (!user) {
        notFound();
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
        alternates: {
            canonical: `https://www.gigo.dev/user/${user.user_name}`,
        }
    };
}

async function fetchUser(id: string): Promise<User | null> {
    try {
        // check if the user id is a snowflake id
        if (!/^[0-9]{19}$/.test(id)) {
            // handle username by retrieving the user id
            const response = await fetch(`${config.rootPath}/api/user/getId`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: id }),
            });

            if (!response.ok) {
                return null;
            }

            let data = await response.json();
            if (data["id"] !== undefined) {
                id = data["id"];
            } else {
                return null;
            }
        }

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
    const headersList = headers();
    const isMobile = headersList.get('X-Device-Type') === "mobile";
    const user = await fetchUser(params.id);
    // ensure that the user id is always correct
    if (user) {
        params.id = user._id;
    }

    if (!user) {
        notFound();
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