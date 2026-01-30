export default async function handler(req, res) {
    // Дозволяємо доступ (CORS) для нашого сайту
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
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
                'User-Agent': 'Mozilla/5.0' // Імітуємо браузер
            },
            body: JSON.stringify({
                "PpType": "PPP",
                "PpNum": ppNum
            })
        });

        const data = await pfuResponse.json();
        res.status(200).json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ PpStatus: "Помилка з'єднання з сервером ПФУ" });
    }
}