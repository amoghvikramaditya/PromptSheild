# PromptShield

PromptShield is an AI-powered prompt security firewall for LLM-based applications. It analyzes, classifies, and defends against prompt injection and risky prompt patterns, providing real-time analysis, threat detection, and actionable insights to help users and developers maintain safe and ethical AI interactions.

---

## 🚀 Project Overview

PromptShield is designed to protect users and AI systems from prompt injection attacks and unsafe prompt patterns. It provides:
- Real-time prompt analysis and risk classification
- Jedi/Sith mode dynamic theming (Star Wars inspired)
- Analytics dashboard with threat trends and insights
- Custom security flag management (with semantic deduplication)
- Safe prompt rewrites and suggestions
- Speech recognition input
- Star Wars themed, responsive UI

---

## 🛠️ Tech Stack & Rationale

### Backend
- **Python (Flask):** Lightweight, easy-to-use web framework for serving the app and API endpoints.
- **LangChain & LangChain-Together:** For LLM orchestration and integration with Together AI (Meta Llama-3 model).
- **ChromaDB:** Fast, persistent vector database for storing and semantically matching custom security flags.
- **Sentence Transformers:** For semantic similarity between prompts and red flags.
- **python-dotenv:** Securely loads API keys and secrets from environment variables.

**Why?**  
Flask is simple and fast for prototyping. LangChain and ChromaDB enable advanced LLM and vector search features. Sentence Transformers allow for robust, semantic flag matching.

### Frontend
- **HTML, CSS (custom + Tailwind), JavaScript:** For a responsive, interactive, and themed UI.
- **Chart.js:** For analytics and data visualization.
- **Web Speech API:** Enables voice input for prompts.
- **Star Wars assets:** Custom fonts, images, and backgrounds for immersive theming.

**Why?**  
Custom CSS and JS allow for a highly themed, interactive experience. Chart.js is lightweight and easy for visualizations. The Web Speech API adds accessibility and fun.

---

## ⚙️ How It Works

1. **Prompt Submission:**  
   Users enter or speak a prompt on the main page.

2. **Analysis Pipeline:**  
   - Heuristic and semantic checks against custom red flags (ChromaDB + Sentence Transformers)
   - LLM-based classification (Jedi/Sith/Padawan) using Meta Llama-3 via Together API
   - Risk scoring and verdict assignment

3. **Safe Rewrites:**  
   Unsafe prompts are rewritten by the LLM (as Obi-Wan) to align with Jedi ethics.

4. **Analytics:**  
   All activity is logged and visualized on the analytics page, including threat trends, detection rates, and flag triggers.

5. **Custom Security Flags:**  
   Users can add new red flags, which are semantically deduplicated and stored in ChromaDB.

---

## 📦 How to Run

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Promptshield
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set your API keys:**
   - Copy `.env.example` to `.env` and add your Together API key:
     ```
     TOGETHER_API_KEY=your_api_key_here
     ```

4. **Run the app:**
   ```bash
   python app.py
   ```

5. **Open your browser:**
   - Go to `http://localhost:5000`

---

## 🖥️ Usage

- Enter prompts on the main page and receive Jedi/Sith verdicts and safe rewrites.
- Switch between Jedi and Sith modes for different UI themes.
- View analytics and security insights on the Analysis page.
- Use voice input for hands-free prompt entry.
- Add custom security flags for advanced protection.

---

## 🧩 Customization

- Update security flags and prompt analysis logic in `promptshield.py`.
- Modify UI styles in `static/style.css` and templates in `templates/`.
- Add your own LLM provider by editing the backend API integration.
- Add new Star Wars assets or themes in the `static/` folder.

---

## 🔒 Security

- API keys and secrets are loaded from `.env` (never commit your real keys).
- `.gitignore` excludes `.env` and any files containing API keys.

---

## 📄 License

[Add your license here] 