
import ArticlesPage from "@/components/Articles/Articles";
import ArticlePage from "@/components/Article/Article";

function parseCustomDate(dateStr: any) {
    // Assuming dateStr is in M-D-YY format
    const [month, day, year] = dateStr.split('-').map(Number);
    // Adjust the year based on your century cutoff logic
    return new Date(year, month - 1, day);
}

export default async function Articles(context: any) {
    const owner = 'Gage-Technologies';
    const repo = 'blogs-gigo.dev';
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/`;

    const data = await fetch(apiUrl).then((response) => response.json());
    try {
        const articles = (await Promise.all(
            data.filter((file: { name: string; }) => file.name.endsWith('.md') && file.name !== 'README.md')
                .map(async (file: { download_url: string | URL | Request; name: string; }) => {
                    const contentResponse = await fetch(file.download_url);
                    const content = await contentResponse.text();
                    const firstLine = content.split('\n')[0].trim();
                    const dateMatch = firstLine.match(/^\d{1,2}-\d{1,2}-\d{4}$/);
                    const dateStr = dateMatch ? dateMatch[0] : 'Unknown Date';
                    const imageUrlMatch = content.match(/!\[.*?\]\((.*?)\)/);
                    const imageUrl = imageUrlMatch ? imageUrlMatch[1] : undefined;

                    return {
                        name: file.name.replaceAll("-", " ").replace('.md', ''),
                        content: content.replace(firstLine + '\n', '').trim(),
                        imageUrl,
                        date: dateStr,
                    };
                })
        )).sort((a, b) => parseCustomDate(b.date).getTime() - parseCustomDate(a.date).getTime());

        // return {
        //     props: { articles }
        // };
        let props = {articles}
        return <ArticlesPage {...props} />;
    } catch (error) {
        console.error('Error listing repository contents:', error);
        return
    }
}
