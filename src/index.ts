import { Command } from 'commander';
import { crawlUrls } from './checks/crawler';
import { isSqlInjection } from './checks/sqlInjection';
import { isXss } from './checks/xss';
import { scanPorts } from './ports/portScanner';
import url from 'url';

const program = new Command();

program
    .version('1.0.0')
    .description('Advanced Vulnerability Scanner')
    .option('-u, --url <url>', 'Target URL to scan');

program.parse(process.argv);

const options = program.opts();

if (!options.url) {
    console.error('Please specify a target URL using -u or --url option.');
    process.exit(1);
}

async function scan(targetUrl: string) {
    try {
        const parsedUrl = new url.URL(targetUrl);
        const host = parsedUrl.hostname;

        console.log(`Scanning ${targetUrl} for vulnerabilities...`);

        // Uncomment and use if you need to scan for open ports
        console.log('Scanning for open ports...');
        const openPorts = await scanPorts(host);
        console.log(`Open Ports: ${openPorts.join(', ')}`);

        const urls = await crawlUrls(targetUrl);

        if (urls.length === 0) {
            console.log('No URLs found during crawling.');
        }

        for (const url of urls) {
            console.log(`Scanning ${url}`);

            try {
                const sqlInjectionResult = await isSqlInjection(url);
                console.log(`SQL Injection Check: URL=${url}, Vulnerable=${sqlInjectionResult.vulnerable}`);
                if (sqlInjectionResult.vulnerable) {
                    console.log(`SQL Injection vulnerability found at ${url} (Response Time: ${sqlInjectionResult.responseTime}ms)`);
                } else {
                    console.log("here");
                    console.log(`No SQL Injection vulnerability at ${url} (Response Time: ${sqlInjectionResult.responseTime}ms)`);
                }
            } catch (error) {
                console.error(`Error checking SQL Injection for ${url}:`, error);
            }

            try {
                const xssResult = await isXss(url);
                console.log(`XSS Check: URL=${url}, Vulnerable=${xssResult.vulnerable}`);
                if (xssResult.vulnerable) {
                    console.log("here");
                    console.log(`XSS vulnerability found at ${url} (Response Time: ${xssResult.responseTime}ms)`);
                } else {
                    console.log("here");
                    console.log(`No XSS vulnerability at ${url} (Response Time: ${xssResult.responseTime}ms)`);
                }
            } catch (error) {
                console.error(`Error checking XSS for ${url}:`, error);
            }
        }

        console.log('Scanning completed.');
    } catch (error) {
        console.error('An error occurred during scanning:', error);
    }
}

scan(options.url);
