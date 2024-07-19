import { Command } from 'commander';
import { crawlUrls } from './checks/crawler';
import { isSqlInjection } from './checks/sqlInjection';
import { isXss } from './checks/xss';

const program = new Command();

program
    .version('1.0.0')
    .description('Simple Vulnerability Scanner')
    .option('-u, --url <url>', 'Target URL to scan');

program.parse(process.argv);

const options = program.opts();

if (!options.url) {
    console.error('Please specify a target URL using -u or --url option.');
    process.exit(1);
}

async function scan(targetUrl: string) {
    console.log(`Scanning ${targetUrl} for vulnerabilities...`);
    const urls = await crawlUrls(targetUrl);
    for (const url of urls) {
        if (await isSqlInjection(url)) {
            console.log(`SQL Injection vulnerability found at ${url}`);
        }
        if (await isXss(url)) {
            console.log(`XSS vulnerability found at ${url}`);
        }
    }
    console.log('Scanning completed.');
}

scan(options.url);