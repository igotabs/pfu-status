export default async function handler(req, res) {
    // CORS (дозволяємо доступ з вашого сайту)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { ppNum } = req.body;

    if (!ppNum) {
        return res.status(400).json({ error: 'Номер обов\'язковий' });
    }

    try {
        const pfuResponse = await fetch('https://portal.pfu.gov.ua/api/PpStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Маскуємось під справжній браузер
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Referer': 'https://portal.pfu.gov.ua/',
                'Origin': 'https://portal.pfu.gov.ua'
            },
            body: JSON.stringify({
                "PpType": "PPP",
                "PpNum": ppNum
            })
        });

        // Якщо сервер ПФУ повернув помилку (наприклад, 403 Forbidden)
        if (!pfuResponse.ok) {
            throw new Error(`HTTP error! status: ${pfuResponse.status}`);
        }

        const data = await pfuResponse.json();
        res.status(200).json(data);

    } catch (error) {
        console.error("PFU Fetch Error:", error);
        res.status(500).json({ PpStatus: "ПФУ блокує запит (спрацював захист сервера)." });
    }
}