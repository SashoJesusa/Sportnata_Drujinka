import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddProduct.css";
import { buildApiUrl } from "../config/api";

const OBLASTI = [
  "Благоевград", "Бургас", "Варна", "Велико Търново", "Видин", "Враца", 
  "Габрово", "Добрич", "Кърджали", "Кюстендил", "Ловеч", "Монтана", 
  "Пазарджик", "Перник", "Плевен", "Пловдив", "Разград", "Русе", 
  "Силистра", "Сливен", "Смолян", "София (град)", "Софийска област", 
  "Стара Загора", "Търговище", "Хасково", "Шумен", "Ямбол"
];

const CATEGORY_OPTIONS = [
  "Зеленчуци", "Плодове", "Зърнени храни", "Животновъдство",
  "Млечни продукти", "Билки и подправки", "Друго",
];

const INITIAL_STATE = {
  name: "",
  category: "",
  price: "",
  oblast: "",
  description: "",
};

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_STATE);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const sessionId = localStorage.getItem("sessionId");
    if (!savedUser || !sessionId) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    if (window.confirm("Сигурни ли сте, че искате да изчистите формата?")) {
      setForm(INITIAL_STATE);
      setImageFile(null);
      setImagePreview("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      navigate("/login", { replace: true });
      return;
    }
    
    // Създаваме FormData обект
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("oblast", form.oblast);
    formData.append("description", form.description);
    formData.append("image", imageFile); // Самото име на променливата 'image' трябва да съвпада с upload.single('image') в backend-а

    try {
        const myHeaders = new Headers();
      myHeaders.append("X-Session-Id", sessionId);

        const response = await fetch(buildApiUrl("/add-product"), {
            method: "POST",
            headers: myHeaders,
            body: formData, // Важно: Не слагай Headers за JSON, браузърът сам ще сложи нужния Boundary
        });

        const result = await response.json();
        if (result.success) {
            alert("Обявата е публикувана успешно!");
            navigate("/"); // Пренасочване към началната страница
        } else {
            alert("Грешка: " + result.error);
        }
    } catch (error) {
        alert("Неуспешна връзка със сървъра.");
    }
};

  return (
    <div className="ap-page">
      <div className="ap-header">
        <span className="ap-header-icon">🌾</span>
        <div>
          <h1 className="ap-title">Добави продукт</h1>
          <p className="ap-subtitle">Попълнете формата, за да предложите своята продукция</p>
        </div>
      </div>

      <form className="ap-form" onSubmit={handleSubmit}>
        <div className="ap-field">
          <label className="ap-label">Наименование</label>
          <input 
            className="ap-input" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="напр. Домати сорт Розова магия" 
            required 
          />
        </div>

        <div className="ap-field">
          <label className="ap-label">Категория</label>
          <select className="ap-select" name="category" value={form.category} onChange={handleChange} required>
            <option value="">– Избери категория –</option>
            {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="ap-field">
          <label className="ap-label">Цена (€)/кг</label>
          <input 
            className="ap-input" 
            name="price" 
            type="number" 
            min="0.01" 
            step="0.01" 
            value={form.price} 
            onChange={handleChange} 
            placeholder="0.00" 
            required 
          />
        </div>

        <div className="ap-field">
          <label className="ap-label">📍 Област</label>
          <select 
            className="ap-select" 
            name="oblast" 
            value={form.oblast} 
            onChange={handleChange} 
            required
          >
            <option value="">– Избери местоположение –</option>
            {OBLASTI.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="ap-field">
          <label className="ap-label">Снимка на продукта</label>
          <label className="ap-upload-box">
            <input
              className="ap-file-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            <span className="ap-upload-text">📷 Качи снимка (JPG, PNG, WEBP)</span>
          </label>
          {imageFile && <p className="ap-file-name">Избрана снимка: {imageFile.name}</p>}
          {imagePreview && (
            <div className="ap-preview-wrap">
              <img src={imagePreview} alt="Преглед на продукта" className="ap-preview-image" />
            </div>
          )}
        </div>

        <div className="ap-field">
          <label className="ap-label">Описание</label>
          <textarea 
            className="ap-textarea" 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="Опишете продукта..." 
            rows={5}
            required
          />
        </div>

        <div className="ap-actions">
          <button type="button" className="ap-btn-secondary" onClick={handleReset}>
            Изчисти
          </button>
          <button type="submit" className="ap-submit">
            <span>🌿</span> Публикувай
          </button>
        </div>

        <button type="button" className="ap-back-link" onClick={() => navigate("/home")}>
          ← Обратно към сайта
        </button>
      </form>
    </div>
  );
}