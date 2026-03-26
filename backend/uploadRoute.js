const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

// Свързване със Supabase (използва променливите от твоя .env файл)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Настройка на Multer да пази файла временно в паметта (RAM)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Основният маршрут за качване
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        // 1. Проверка дали изобщо е пратена снимка
        if (!req.file) {
            return res.status(400).json({ error: "Моля, прикачете снимка." });
        }

        // 2. Взимаме ID-то на обявата от тялото на заявката
        const adId = req.body.adId;
        if (!adId) {
            return res.status(400).json({ error: "Липсва adId (ID на обявата)." });
        }

        // 3. Генерираме уникално име на файла (ad_ID_TIMESTAMP.jpg)
        const fileName = `ad_${adId}_${Date.now()}.jpg`;

        // 4. Качваме файла в Supabase Storage (bucket: product-images)
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true // Ако има файл със същото име, го презаписва
            });

        if (uploadError) throw uploadError;

        // 5. Взимаме публичния линк към вече качената снимка
        const { data: publicData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

        const imageUrl = publicData.publicUrl;

        // 6. МАГИЯТА: Обновяваме колоната 'photo' в таблица 'products'
        const { error: dbError } = await supabase
            .from('products')
            .update({ photo: imageUrl }) // Записваме линка тук
            .eq('id', adId);            // Търсим реда, където id съвпада с пратеното adId

        if (dbError) throw dbError;

        // 7. Връщаме отговор на клиента
        res.json({
            message: "Снимката е качена и свързана с обявата успешно! 🚀",
            imageUrl: imageUrl,
            productId: adId
        });

    } catch (err) {
        console.error("Грешка при качване:", err.message);
        res.status(500).json({ error: "Възникна грешка при обработката на снимката." });
    }
});

module.exports = router;