# 🏆 GSCR Agentic Control Center: Autonomous Supply Chain Resilience

### (Winner Submission for Agentic AI Hackathon with IBM watsonx Orchestrate)

---

## 💡 The Challenge & Our Solution (Business Value)

This project tackles the costly and slow process of managing sudden global disruptions.

| **Problem** | Global geopolitical or environmental events (e.g., port closures, conflicts) lead to **manual, delayed supply chain re-routing**, causing weeks of disruption and **millions in unrecoverable losses** per incident. |
| :--- | :--- |
| **Solution** | The **GSCR-Agent** automates the entire mitigation process—from detection to execution—using AI. It provides **real-time risk assessment and autonomous mitigation planning**, cutting resolution time from weeks to minutes. |

---

## ⚙️ Technology & Architecture (Application of Technology)

Our architecture is designed to showcase the power of **watsonx Orchestrate** in managing complex, multi-system workflows.

### Core Technologies Used:
* **IBM watsonx Orchestrate:** The **core engine** used for defining the Agent's state machine, orchestrating complex workflows, and integrating LLM-powered decision-making with business skills. *(Crucial for scoring!)*
* **Python/Flask (with Flask-CORS):** Used to build the secure, scalable **Mock Backend APIs** that simulate external services (Logistics Quotes, SCM Systems).
* **HTML/CSS/JS (Source Code Pro Theme):** Built a High-Fidelity, Dynamic Control Center UI to deliver the **Human-Agent Collaboration Wow Factor**.

### Agentic Flow: Orchestration in Action
The GSCR-Agent executes a sophisticated, reflective flow:
1.  **Detection (Digital Skill 1):** The Agent continuously monitors external risk feeds and identifies a critical event (e.g., "Port X Closure").
2.  **Analysis & Action (Digital Skill 2):** The Agent instantly identifies all impacted critical SKUs and calls a skill to gather multiple alternative logistics quotes (Time and Cost).
3.  **LLM Decision (Reflection):** Using the internal **Mitigation Strategy Knowledge Base** (our `knowledge_base.txt`), the Agent's LLM component ranks the alternatives and selects the *Optimal* route that minimizes time and risk, as per policy.
4.  **Action:** The Agent presents the pre-calculated, optimal decision to the human operator for **one-click "Approve"**, then executes the change via Digital Skill 3 (SCM update).

---

## 🚀 Setup and Launch Guide (For Judges)

The entire project is designed to run locally for a seamless demo.

### Prerequisites
1.  Access to **IBM watsonx Orchestrate** (Hackathon Trial/Instance).
2.  Python 3.x, Pip, and Git.

### Local Launch Steps (Run these commands in separate terminal windows):
1.  Clone the repository and activate your virtual environment.
2.  Install dependencies: `pip install Flask flask-cors`
3.  **Launch Backend (CMD 1):** `python src/mock_api.py` (Runs on Port 5000)
4.  **Launch Frontend (CMD 2):** Navigate to the `ui` folder (`cd ui`) and run `python -m http.server` (Runs on Port 8000)
5.  Access the UI: `http://127.0.0.1:8000/index.html`

---

## 🧑‍💻 Team Information
**Solo Developer:** Anum Munir