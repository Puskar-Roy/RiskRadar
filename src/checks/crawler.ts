import axios from 'axios';
import cheerio from 'cheerio';
import { URL } from 'url';

export async function crawlUrls(baseUrl: string): Promise<string[]> {
    const urls = new Set<string>(); // Use a Set to store unique URLs
    try {
        const { data } = await axios.get(baseUrl);
        const $ = cheerio.load(data);

        $('a[href]').each((i, link) => {
            let href = $(link).attr('href');
            if (href) {
                try {
                    const absoluteUrl = new URL(href, baseUrl).href;
                    // Filter out URLs that are just fragments or hash links
                    if (absoluteUrl !== baseUrl && !absoluteUrl.includes('#')) {
                        urls.add(absoluteUrl); // Add to Set
                    }
                } catch (e) {
                    console.error('Error parsing URL:', href, e);
                }
            }
        });

        console.log(`Crawled URLs from ${baseUrl}:`, Array.from(urls));
    } catch (error) {
        console.error(`Error crawling ${baseUrl}:`, error);
    }
    return Array.from(urls);
}
