import React from 'react';
import config from '@/config';
import { Metadata, ResolvingMetadata } from 'next';
import { checkSessionStatus, getSessionCookies } from '@/services/utils';
import { cookies } from 'next/headers';
import { Unit } from '@/models/journey';
import JsonLd from '@/components/JsonLD';
import JourneyInfo from '@/components/Journey/JourneyInfo';
import JourneyInfoMobile from '@/components/Journey/JourneyInfoMobile';

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
    let unitPromise: {
        unit: Unit;
    } = await fetch(
        `${config.rootPath}/api/journey/getUnitMetadata`,
        {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ unit_id: params.id }),
            next: {revalidate: 86400}
        }
    ).then((res) => {
        if (res.status === 200) {
            return res.json()
        }
        return null
    })

    if (unitPromise === null || !unitPromise.unit) {
        return {}
    }

    const unit = unitPromise.unit;

    return {
        applicationName: `${unit.name}`,
        title: `${unit.name}`,
        description: unit.description || '',
        keywords: ['coding', 'programming', 'learning', 'journey', 'developers', ...unit.tags, ...unit.langs],
        openGraph: {
            title: `${unit.name} - Journey Unit - GIGO Dev`,
            description: unit.description || '',
            type: 'website',
            url: 'https://gigo.dev/journey/info/' + params.id,
            images: [
                {
                    url: `${config.rootPath}/static/junit/t/${unit._id}`,
                    width: 200,
                    height: 200,
                    alt: `${unit.name} Thumbnail`,
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

export default async function HandleJourneyInfo({ params, searchParams }: { params: { id: string }, searchParams: { viewport?: string } }) {
    const isMobile = searchParams.viewport === "mobile";
    const headers: any = {
        "Content-Type": "application/json",
    }

    if (checkSessionStatus(cookies().get('gigoAuthToken'))) {
        headers['Cookie'] = getSessionCookies(cookies());
    }

    let unitPromise: {
        unit: Unit;
    } = await fetch(
        `${config.rootPath}/api/journey/getUnitMetadata`,
        {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ unit_id: params.id }),
            next: {revalidate: 86400}
        }
    ).then((res) => {
        if (res.status === 200) {
            return res.json()
        }
        return {
            unit: {} as Unit,
        }
    })
    
    // create json-ld data
    const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "name": unitPromise.unit.name,
        "description": unitPromise.unit.description,
        "url": `https://gigo.dev/journey/info/${params.id}`,
        "provider": {
            "@type": "Organization",
            "name": "GIGO Dev",
            "url": "https://gigo.dev"
        },
        "educationalLevel": "Beginner to Advanced",
        "learningResourceType": "Journey Unit",
        "keywords": [...unitPromise.unit.tags, ...unitPromise.unit.langs],
        "image": `${config.rootPath}/static/junit/t/${unitPromise.unit._id}`
    };

    return (
        <>
            <JsonLd data={jsonLdData} />
            {isMobile ? (
                <JourneyInfoMobile params={params} />
            ) : (
                <JourneyInfo params={params} />
            )}
        </>
    )
}

