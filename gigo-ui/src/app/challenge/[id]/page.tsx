
import Challenge from "@/components/Pages/Challenge/Challenge";
import config from "@/config";
import Attempt from "@/models/attempt";
import Post from "@/models/post";
import { checkSessionStatus, getSessionCookies } from "@/services/utils";
import {cookies} from "next/headers";
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
    { params }: { params: { id: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {

    // fetch data
    let projectPromise: {
        post: Post;
        attempt: Attempt | null;
        description: string;
        evaluation: string;
    } | null = await fetch(
        `${config.rootPath}/api/project/get`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post_id: params.id }),
            next: {revalidate: 86400 * 7}
        }
    ).then((res) => {
        if (res.status === 200) {
            return res.json()
        }
        return null
    })

    if (projectPromise === null) {
        return {}
    }

    return {
        applicationName: `${projectPromise.post.title} - GIGO Dev`,
        title: `${projectPromise.post.title} - GIGO Dev`,
        description: projectPromise.post.description,
        keywords: ['coding', 'programming', 'learning', 'challenges', 'developers', 'cloud development'],
        openGraph: {
            title: `${projectPromise.post.title} - GIGO Dev`,
            description: projectPromise.post.description,
            type: 'website',
            url: 'https://gigo.dev/challenge/' + params.id,
            images: [
                {
                    url: config.rootPath + projectPromise.post.thumbnail,
                    width: 250,
                    height: 250,
                    alt: `${projectPromise.post.title} Thumbnail`,
                },
                {
                    url: 'https://gigo.dev/logo192.png',
                    width: 192,
                    height: 192,
                    alt: 'GIGO Dev Logo',
                },
            ],
            siteName: 'GIGO Dev',
        }
    }
}

async function ChallengePage({ params }: { params: { id: string } }) {
    const headers: any = {
        "Content-Type": "application/json",
    }

    if (checkSessionStatus(cookies().get('gigoAuthToken'))) {
        headers['Cookie'] = getSessionCookies(cookies());
    }


    let projectPromise: {
        post: Post;
        attempt: Attempt | null;
        description: string;
        evaluation: string;
    } = await fetch(
        `${config.rootPath}/api/project/get`,
        {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ post_id: params.id }),
            next: {revalidate: 86400}
        }
    ).then((res) => {
        if (res.status === 200) {
            return res.json()
        }
        return {
            post: {} as Post,
            attempt: null,
            description: "",
            evaluation: "",
        }
    })
    
    return <Challenge 
        params={params} 
        project={projectPromise.post} 
        userAttempt={projectPromise.attempt}
        projectDesc={projectPromise.description}
        projectEval={projectPromise.evaluation}
    />
}

export default ChallengePage
