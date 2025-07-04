# ⭐️ PromptShield: The Jedi Firewall for AI Prompts

> “May the prompt be with you.”

PromptShield is a Star Wars-inspired, AI-powered firewall for Large Language Model (LLM) prompts. It analyzes, classifies, and defends against prompt injection and risky prompt patterns, providing real-time analysis, threat detection, and actionable insights to help users and developers maintain safe and ethical AI interactions. 

---

## 1. 🌌 What is PromptShield?

PromptShield is your Jedi guardian in the galaxy of AI. It stands between your LLM-powered app and the dark side of prompt injection, jailbreaks, and unsafe user input. With real-time analysis, Jedi/Sith theming, and actionable insights, PromptShield helps you keep your AI safe, responsible, and fun.

---

## 2. 🛠️ Tech Stack Used (and Why)

### Backend
- **Python (Flask):** Simple, fast, and perfect for rapid prototyping REST APIs.
- **LangChain & LangChain-Together:** For LLM orchestration and integration with Together AI (Meta Llama-3 model).
- **ChromaDB:** Persistent vector database for storing and semantically matching custom security flags.
- **Sentence Transformers:** For robust semantic similarity between prompts and red flags.
- **python-dotenv:** Securely loads API keys and secrets from environment variables.

### Frontend
- **HTML, CSS (custom + Tailwind), JavaScript:** For a responsive, interactive, and highly themed UI.
- **Chart.js:** For analytics and data visualization.
- **Web Speech API:** Enables voice input for prompts.
- **Star Wars assets:** Custom fonts, images, and backgrounds for immersive theming.

**Why?**  
The stack is chosen for rapid development, advanced LLM features, and a unique, immersive user experience.

---

## 3. 🚀 Chosen Track

**AI/ML**

PromptShield leverages LLMs, semantic search, and AI-driven analytics to protect and enhance prompt-based applications.

---

## 4. ⚠️ The Problem We're Solving

Prompt injection and unsafe prompt patterns are a growing threat in LLM-powered applications. Attackers can manipulate AI behavior, leak sensitive data, or bypass safety controls. PromptShield:
- Detects and blocks risky prompts (the "Sith")
- Suggests safe rewrites (the "Jedi" way)
- Provides analytics and insights to help you monitor and improve your AI security
- Lets you add custom security flags, with semantic deduplication

---

## 5. 💡 Business Model (if applicable)

PromptShield is open source and free for the community. For commercial use, it could be offered as:
- A managed API service for LLM prompt security
- A plug-and-play security layer for enterprise AI apps
- Custom consulting and integration for large organizations

---

## 6. 🏆 Bounties/Challenges Completed

- Followed the star wars theme
- Mascot (FN-R0GUE) generated
- Added Ester egg in the website

---

## 7. 🌐 Live Demo

- [Live Website](https://your-deployment-link.com) <!-- Replace with your actual link -->

---

## 8. 📦 How to Run

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

## 9. 🖥️ Usage

- Enter prompts on the main page and receive Jedi/Sith verdicts and safe rewrites.
- Switch between Jedi and Sith modes for different UI themes.
- View analytics and security insights on the Analysis page.
- Use voice input for hands-free prompt entry.
- Add custom security flags for advanced protection.

---

## 10. 🧩 Customization

- Update security flags and prompt analysis logic in `promptshield.py`.
- Modify UI styles in `static/style.css` and templates in `templates/`.
- Add your own LLM provider by editing the backend API integration.
- Add new Star Wars assets or themes in the `static/` folder.

---

## 11. 🔒 Security

- API keys and secrets are loaded from `.env` (never commit your real keys).
- `.gitignore` excludes `.env` and any files containing API keys.

---

## 12. 📄 License

[Add your license here]

---

> "The Force will be with you. Always." 
