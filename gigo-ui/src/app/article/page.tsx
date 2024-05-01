
import ArticlePage from "@/components/Article/Article"

// export async function getServerSideProps(context) {
//     const { articleName } = context.params;
//     const markdownContents = await fetchArticle(articleName);
//
//     return {
//         props: {
//             markdownContents,
//             articleName,
//         },
//     };
// }

export default async function Article(context: any) {


    let articleName = context.params;

    const owner = 'Gage-Technologies';
    const repo = 'blogs-gigo.dev';
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/master/${articleName}.md`;
    await fetch(
        `${url}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: '{}',
            cache: "force-cache",
            next: { revalidate: 86400 }
        }
    ).then(async (response) => {
        let markdownContents = response.text();
        let props = {
            markdownContents,
            articleName
        }
        return <ArticlePage {...props} />;
    })
    return
}
