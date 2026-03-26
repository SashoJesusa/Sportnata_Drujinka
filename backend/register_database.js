require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors()); 
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://ekprkexcxdblouybpnui.supabase.co', 
    process.env.SUPABASE_KEY || 'sb_publishable_Bdeh-WGPcKAETVdBJ5DSzg_axWtQ2LH'
);

// --- РЕГИСТРАЦИЯ ---
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('profiles')
            .insert([{ username, email, password: hashedPassword }])
            .select();

        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Грешка в сървъра" });
    }
});

// --- ВХОД ---
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data: user, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) return res.status(401).json({ error: "Грешен имейл или парола" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Грешен имейл или парола" });
        console.log(user);
         const { data: sessionData } = await supabase
            .from('sessions')
            .insert([{ user_id: user.user_id, expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000) }])
            .select();
            console.log(sessionData);
        res.json({ success: true, user: { username: user.username, session_id: sessionData.session_id } });
    } catch (err) {
        res.status(500).json({ error: "Грешка при вход" });
    }
});

app.listen(4000, () => console.log("Сървър: http://localhost:4000"));