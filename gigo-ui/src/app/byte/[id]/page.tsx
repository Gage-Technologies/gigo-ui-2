import ByteViewportRouter from "@/components/Pages/Byte/ByteViewportRouter";
import config from "@/config";
import { Byte } from "@/models/bytes";
import type { Metadata, ResolvingMetadata } from 'next'
import JsonLd from '@/components/JsonLD';

export async function generateMetadata(
    { params }: { params: { id: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {

    const byte = await fetch(
        `${config.rootPath}/api/bytes/getByte`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({byte_id: params.id}),
            next: {revalidate: 86400 * 7}
        }).then(async res => {
            if (!res.ok) {
                return null
            }
            const data = await res.json()
            return data["rec_bytes"] as Byte
        })

    if (byte === null) {
        return {}
    }

    return {
        applicationName: `${byte.name} - Byte - GIGO Dev`,
        title: `${byte.name} - Byte - GIGO Dev`,
        description: byte.description_medium,
        keywords: ['coding', 'programming', 'learning', 'challenges', 'developers', 'cloud development'],
        openGraph: {
            title: `${byte.name} - Byte - GIGO Dev`,
            description: byte.description_medium,
            type: 'website',
            url: 'https://gigo.dev/attempt/' + params.id,
            images: [
                {
                    url: config.rootPath + "/static/bytes/t/" + byte._id,
                    width: 250,
                    height: 250,
                    alt: `${byte.name} Thumbnail`,
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

export default async function HandleByte({ params }: { params: { id: string } }) {
  const byte = await fetch(
    `${config.rootPath}/api/bytes/getByte`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({byte_id: params.id}),
        next: {revalidate: 86400}
    }).then(async res => {
        if (!res.ok) {
            return {} as Byte
        }
        const data = await res.json()
        return data["rec_bytes"] as Byte
    })

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": byte.name,
    "description": byte.description_medium,
    "provider": {
      "@type": "Organization",
      "name": "GIGO Dev"
    },
    "url": `https://gigo.dev/byte/${params.id}`
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <ByteViewportRouter byte={byte} params={params} />
    </>
  );
}