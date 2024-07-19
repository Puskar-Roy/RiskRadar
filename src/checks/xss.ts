import axios from 'axios';

export async function isXss(url: string): Promise<boolean> {
    const payloads = ['<script>alert("XSS")</script>'];
    for (const payload of payloads) {
        try {
            const { data } = await axios.get(`${url}?q=${encodeURIComponent(payload)}`);
            if (data.includes(payload)) {
                return true;
            }
        } catch (error) {
            console.error(`Error testing XSS on ${url}:`, error);
        }
    }
    return false;
}