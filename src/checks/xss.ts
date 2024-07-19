import axios from 'axios';

const PAYLOADS = ['<script>alert("XSS")</script>'];

export async function isXss(url: string): Promise<{ vulnerable: boolean, responseTime: number }> {
    for (const payload of PAYLOADS) {
        try {
            const start = Date.now();
            const { data } = await axios.get(`${url}?q=${encodeURIComponent(payload)}`);
            const responseTime = Date.now() - start;

            if (data.includes(payload)) {
                console.log(`Potential XSS vulnerability found with payload: ${payload}`);
                return { vulnerable: true, responseTime };
            }
        } catch (error) {
            console.error(`Error testing XSS on ${url}:`, error);
        }
    }
    return { vulnerable: false, responseTime: 0 };
}
