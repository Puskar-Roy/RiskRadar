
const ports = [
    20, 21, 
    22, 
    23, 
    25, 
    53, // DNS
    80, // HTTP
    110, // POP3
    143, // IMAP
    443, // HTTPS
    465, // SMTPS
    587, // SMTP (submission)
    993, // IMAPS
    995, // POP3S
    3306, // MySQL
    5432, // PostgreSQL
    6379, // Redis
    8080, // HTTP (alternative)
    8888, // HTTP (alternative)
    9200, // Elasticsearch
    27017 // MongoDB
];

async function checkPort(host: string, port: number): Promise<boolean> {
    const url = `http://${host}:${port}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, 2000);

    try {
        const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
        clearTimeout(timeout);
        return response.ok;
    } catch (error) {
        // if (error.name === 'AbortError') {
        // }
        // console.log(`Timeout occurred for port ${port}`);
        return false;
    }
}

export async function scanPorts(host: string): Promise<number[]> {
    const openPorts: number[] = [];
    for (const port of ports) {
        const isOpen = await checkPort(host, port);
        if (isOpen) {
            openPorts.push(port);
        }
    }
    return openPorts;
}
