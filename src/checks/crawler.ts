import axios from 'axios';
import cheerio from 'cheerio';

export async function crawlUrls(baseUrl: string): Promise<string[]> {
    const urls: string[] = [];
    try {
        const { data } = await axios.get(baseUrl);
        const $ = cheerio.load(data);
        $('a').each((i, link) => {
            const href = $(link).attr('href');
            if (href && href.startsWith('/')) {
                urls.push(new URL(href, baseUrl).href);
            }
        });
    } catch (error) {
        console.error(`Error crawling ${baseUrl}:`, error);
    }
    return urls;
}