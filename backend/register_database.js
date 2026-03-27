require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');



const app = express();
app.use(cors()); 
app.use(express.json());

// 2. Връзка със Supabase (Изтрих публичните ключове заради сигурността)
const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_KEY
);

async function attachUsernamesToProducts(products) {
    if (!Array.isArray(products) || products.length === 0) return [];

    const userIds = [...new Set(products.map((p) => p.user_id).filter((id) => id != null))];
    if (userIds.length === 0) return products;

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('user_id, username')
        .in('user_id', userIds);

    if (error) {
        console.error('Profiles lookup error:', error);
        return products;
    }

    const usernameByUserId = new Map((profiles || []).map((profile) => [profile.user_id, profile.username]));

    return products.map((product) => ({
        ...product,
        username: usernameByUserId.get(product.user_id) || null,
    }));
}

// ==========================================
// --- РЕГИСТРАЦИЯ (Код на колегата) ---
// ==========================================
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

// ==========================================
// --- ВХОД (Новият код на колегата) ---
// ==========================================
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

            // Create session for new user
        const { data: sessionData } = await supabase
            .from('sessions')
            .insert([{ user_id: user.user_id, expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000) }])
            .select();
        
        return res.status(201).json({ 
            success: true, 
            user: { username: user.username },
            sessionId: sessionData[0].session_id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Грешка при вход" });
    }
});

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Пазим снимката временно в RAM

app.post('/add-product', upload.single('image'), async (req, res) => {
    try {
        const { name, category, price, oblast, description } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ error: "Снимката е задължителна" });

        // 1. Качване на снимката в Supabase Storage
        const fileName = `${Date.now()}-${file.originalname}`;
        const { data: storageData, error: storageError } = await supabase.storage
            .from('product-images') // Името на твоя Bucket в Supabase
            .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (storageError) throw storageError;

        // Вземане на публичния URL на снимката
        const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

        const imageUrl = urlData.publicUrl;
        const sessionId = req.headers['x-session-id'];
        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .select('user_id')
            .eq('session_id', sessionId)
            .single();

        if (sessionError || !session){
            console.error("Session error:", sessionError);
            return res.status(401).json({ error: "Сесията е невалидна" });
        }

        const userId = session.user_id;

        // 2. Запис на данните в таблица 'products'
        const { data: productData, error: productError } = await supabase
            .from('products')
            .insert([{ 
                product: name, 
                user_id: userId,
                category, 
                price: parseFloat(price), 
                region: oblast, 
                description, 
                image_url: imageUrl 
            }]);

        if (productError) throw productError;

        res.status(201).json({ success: true, message: "Обявата е добавена!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Грешка при запис на обявата" });
    }
});

app.get('/my-products', async (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'];
        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .select('user_id')
            .eq('session_id', sessionId)
            .single();

        if (sessionError || !session) {
            return res.status(401).json({ error: "Сесията е невалидна" });
        }

        const { data: products, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('user_id', session.user_id);

        if (productError) throw productError;

        const productsWithUsernames = await attachUsernamesToProducts(products || []);
        res.status(200).json({ success: true, products: productsWithUsernames });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Грешка при извличане на обявите" });
    }
});

app.get('/all-products', async (req, res) => {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*');

        if (error) throw error;

        const productsWithUsernames = await attachUsernamesToProducts(products || []);
        res.status(200).json({ success: true, products: productsWithUsernames });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Грешка при извличане на обявите" });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const requestedId = Number(req.params.id);
        if (Number.isNaN(requestedId)) {
            return res.status(400).json({ success: false, error: 'Невалидно ID на продукт.' });
        }

        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .eq('offer_id', requestedId)
            .limit(1);

        if (error) throw error;

        const product = products?.[0] || null;
        if (!product) {
            return res.status(404).json({ success: false, error: 'Продуктът не е намерен.' });
        }

        const [productWithUsername] = await attachUsernamesToProducts([product]);
        res.status(200).json({ success: true, product: productWithUsername || product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Грешка при извличане на продукта' });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const productId = Number(req.params.id);
        if (Number.isNaN(productId)) {
            return res.status(400).json({ success: false, error: 'Невалидно ID на продукт.' });
        }

        const sessionId = req.headers['x-session-id'];
        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .select('user_id')
            .eq('session_id', sessionId)
            .single();

        if (sessionError || !session) {
            return res.status(401).json({ error: "Сесията е невалидна" });
        }

        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('user_id, image_url')
            .eq('offer_id', productId)
            .single();

        if (fetchError || !product) {
            return res.status(404).json({ success: false, error: 'Продуктът не е намерен.' });
        }

        if (product.user_id !== session.user_id) {
            return res.status(403).json({ error: "Нямаш разрешение да изтриеш това." });
        }

        if (product.image_url) {
            const fileName = product.image_url.split('/').pop();
            await supabase.storage.from('product-images').remove([fileName]);
        }

        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('offer_id', productId);

        if (deleteError) throw deleteError;

        res.status(200).json({ success: true, message: "Обявата е изтрита!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Грешка при изтриване на обявата" });
    }
});

// Create a post
app.post('/posts', async (req, res) => {
    try {
        const { title, text, category } = req.body;
        const sessionId = req.headers['x-session-id'];

        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .select('user_id')
            .eq('session_id', sessionId)
            .single();

        if (sessionError || !session) {
            return res.status(401).json({ error: "Сесията е невалидна" });
        }

        const { data: post, error: postError } = await supabase
            .from('posts')
            .insert([{ title, text, category, author_id: session.user_id }])
            .select();

        if (postError) throw postError;

        res.status(201).json({ success: true, post: post[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Грешка при създаване на пост" });
    }
});

// Get all posts with replies and usernames
app.get('/posts', async (req, res) => {
    try {
        const { data: posts, error: postsError } = await supabase
            .from('posts')
            .select('*')
            .order('id', { ascending: false });

        if (postsError) throw postsError;

        const postsWithData = await Promise.all(
            (posts || []).map(async (post) => {
                const { data: author } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('user_id', post.author_id)
                    .single();

                const { data: replies } = await supabase
                    .from('post_replies')
                    .select('*')
                    .eq('post_id', post.id)
                    .order('id', { ascending: true });

                const repliesWithData = await Promise.all(
                    (replies || []).map(async (reply) => {
                        const { data: replyAuthor } = await supabase
                            .from('profiles')
                            .select('username')
                            .eq('user_id', reply.author_id)
                            .single();
                        return { ...reply, username: replyAuthor?.username || null };
                    })
                );

                return { ...post, username: author?.username || null, replies: repliesWithData };
            })
        );

        res.status(200).json({ success: true, posts: postsWithData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Грешка при извличане на постовете" });
    }
});

// Add a reply to a post
app.post('/posts/:postId/replies', async (req, res) => {
    try {
        const { text } = req.body;
        const postId = Number(req.params.postId);
        const sessionId = req.headers['x-session-id'];

        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .select('user_id')
            .eq('session_id', sessionId)
            .single();

        if (sessionError || !session) {
            return res.status(401).json({ error: "Сесията е невалидна" });
        }

        const { data: reply, error: replyError } = await supabase
            .from('post_replies')
            .insert([{ post_id: postId, text, author_id: session.user_id }])
            .select();

        if (replyError) throw replyError;

        const { data: author } = await supabase
            .from('profiles')
            .select('username')
            .eq('user_id', session.user_id)
            .single();

        res.status(201).json({ success: true, reply: { ...reply[0], username: author?.username || null } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Грешка при добавяне на отговор" });
    }
});


const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`Сървър: http://localhost:${port}`));