
import AttemptPageClient from "@/components/Pages/Attempt/Attempt";
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
    let attemptPromise: {
        post: Attempt;
        description: string;
        evaluation?: string;
    } = await fetch(
        `${config.rootPath}/api/attempt/get`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ attempt_id: params.id }),
            next: {revalidate: 86400}
        }
    ).then((res) => {
        if (res.status === 200) {
            return res.json()
        }
        return null
    })

    if (attemptPromise === null) {
        return {}
    }

    return {
        applicationName: `${attemptPromise.post.title || attemptPromise.post.post_title} - Attempt - GIGO Dev`,
        title: `${attemptPromise.post.title || attemptPromise.post.post_title} - Attempt - GIGO Dev`,
        description: attemptPromise.post.description,
        keywords: ['coding', 'programming', 'learning', 'challenges', 'developers', 'cloud development'],
        openGraph: {
            title: `${attemptPromise.post.title || attemptPromise.post.post_title} - Attempt - GIGO Dev`,
            description: attemptPromise.post.description,
            type: 'website',
            url: 'https://gigo.dev/attempt/' + params.id,
            images: [
                {
                    url: config.rootPath + attemptPromise.post.thumbnail,
                    width: 250,
                    height: 250,
                    alt: `${attemptPromise.post.title} Thumbnail`,
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

async function AttemptPage({ params }: { params: { id: string } }) {
    const headers: any = {
        "Content-Type": "application/json",
    }

    if (checkSessionStatus(cookies().get('gigoAuthToken'))) {
        headers['Cookie'] = getSessionCookies(cookies());
    }

    let attemptPromise: {
        post: Attempt;
        description: string;
        evaluation?: string;
    } = await fetch(
        `${config.rootPath}/api/attempt/get`,
        {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ attempt_id: params.id }),
            next: {revalidate: 86400}
        }
    ).then((res) => {
        if (res.status === 200) {
            return res.json()
        }
        return {
            post: {} as Attempt,
            description: "",
        }
    })
    
    return <AttemptPageClient 
        params={params}
        attempt={attemptPromise.post}
        description={attemptPromise.description}
        evaluation={attemptPromise.evaluation || ""}
    />
}

export default AttemptPage
