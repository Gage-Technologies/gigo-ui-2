import ArticlePage from "@/components/Article/Article";

export default async function Article({ params }: { params: { articleName: string } }) {
    const owner = 'Gage-Technologies';
    const repo = 'blogs-gigo.dev';
    console.log("article name: ", `https://raw.githubusercontent.com/${owner}/${repo}/master/${params.articleName}.md`)
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/master/${params.articleName}.md`;
    let renderProps = await fetch(
        `${url}`,
        {
            method: 'GET',
            cache: "force-cache"
        }
    ).then(async (response) => {
        let markdownContents = await response.text();
        return {
            markdownContents,
            articleName: params.articleName
        }
    })
    return <ArticlePage {...renderProps} />
}
