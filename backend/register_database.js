require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// МНОГО ВАЖНО: CORS трябва да е тук, за да позволи на React (порт 5173) да говори с Node (порт 4000)
app.use(cors()); 
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://ekprkexcxdblouybpnui.supabase.co', 
    process.env.SUPABASE_KEY || 'sb_publishable_Bdeh-WGPcKAETVdBJ5DSzg_axWtQ2LH'
);

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Хеширане
        const hashedPassword = await bcrypt.hash(password, 10);

        // Запис в Supabase
        const { error } = await supabase
            .from('profiles')
            .insert([{ username, email, password: hashedPassword }]);

        if (error) throw error;

        res.status(201).json({ success: true, message: "Успешна регистрация!" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

app.listen(4000, () => console.log("🚀 Бекендът работи на порт 4000"));