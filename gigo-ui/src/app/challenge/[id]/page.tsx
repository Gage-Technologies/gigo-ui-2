
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

    const headers: any = {
        "Content-Type": "application/json",
    }

    if (checkSessionStatus(cookies().get('gigoAuthToken'))) {
        headers['Cookie'] = getSessionCookies(cookies());
    }

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
            headers: headers,
            body: JSON.stringify({ post_id: params.id }),
            next: {revalidate: 86400 * 7}
        }
    ).then(async (res) => {
        if (res.status === 200) {
            const data = await res.json()
            if (data["post"] === "user is not authorized to view this post.") {
                return null
            }
            return data
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
    ).then(async (res) => {
        if (res.status === 200) {
            const data = await res.json()
            if (data["post"] === "user is not authorized to view this post.") {
                return {
                    post: {
                        _id: params.id,
                        title: "",
                        description: "[REMOVED]",
                        author: "[REMOVED]",
                        author_id: "[REMOVED]",
                        tags: [],
                        tag_strings: [],
                        created_at: new Date(),
                        updated_at: new Date(),
                        repo_id: "-1",
                        tier: 0,
                        tier_string: "",
                        awards: [],
                        top_reply: null,
                        coffee: 0,
                        post_type: -1,
                        post_type_string: "",
                        views: 0,
                        completions: 0,
                        attempts: 0,
                        languages: [],
                        languages_strings: [],
                        published: true,
                        visibility: 0,
                        visibility_string: "",
                        thumbnail: "",
                        leads: false,
                        challenge_cost: "",
                        exclusive_description: "",
                        name: "",
                        color_palette: "",
                        render_in_front: false,
                        estimated_tutorial_time_millis: null,
                        deleted: true,
                        has_access: true,
                        start_time_millis: 0,
                        stripe_price_id: "",
                        post_title: "",
                    },
                    attempt: null,
                    description: "",
                    evaluation: "",
                }
            }
            return data
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
