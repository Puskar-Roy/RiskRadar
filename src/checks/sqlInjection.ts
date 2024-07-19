import axios from 'axios';

export async function isSqlInjection(url: string): Promise<boolean> {
    const payloads = ["' OR '1'='1", "' OR '1'='1' -- "];
    for (const payload of payloads) {
        try {
            const { data } = await axios.get(`${url}${payload}`);
            if (data.toLowerCase().includes('error') || data.toLowerCase().includes('syntax')) {
                return true;
            }
        } catch (error) {
            console.error(`Error testing SQL Injection on ${url}:`, error);
        }
    }
    return false;
}