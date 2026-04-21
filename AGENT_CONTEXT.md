# 專案上下文 (Agent Context)：workshift-landing

> **最後更新時間**：2026-04-21 03:19
> **自動生成**：由 `prepare_context.py` 產生，供 AI Agent 快速掌握專案全局

---

## 🎯 1. 專案目標 (Project Goal)
* **核心目的**：This template provides a minimal setup to get React working in  Vite with HMR and some ESLint rules.
* _完整說明見 [README.md](README.md)_

## 🛠️ 2. 技術棧與環境 (Tech Stack & Environment)
* **核心套件**：@base-ui/react, @splinetool/react-spline, @splinetool/runtime, @tailwindcss/vite, class-variance-authority, clsx, framer-motion, gsap, lenis, lottie-react
* **開發套件**：@eslint/js, @types/react, @types/react-dom, @vitejs/plugin-react, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals
* **可用指令**：dev, build, lint, preview
* **Python 專案**：使用 pyproject.toml 管理
* _詳見 pyproject.toml 的 dependencies 區塊_

### 原始設定檔

<details><summary>package.json</summary>

```json
{
  "name": "workshift-landing",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@base-ui/react": "^1.3.0",
    "@splinetool/react-spline": "^4.1.0",
    "@splinetool/runtime": "^1.12.69",
    "@tailwindcss/vite": "^4.2.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.34.3",
    "gsap": "^3.14.2",
    "lenis": "^1.3.21",
    "lottie-react": "^2.4.1",
    "lucide-react": "^0.575.0",
    "motion": "^12.38.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.14.0",
    "retune": "^0.4.1",
    "rough-notation": "^0.5.1",
    "shadcn": "^4.1.0",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.2.1",
    "three": "^0.183.2",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "puppeteer": "^24.37.5",
    "vite": "^7.3.1"
  }
}

```
</details>

<details><summary>pyproject.toml</summary>

```toml
[project]
name = "repl-nix-workspace"
version = "0.1.0"
description = "Add your description here"
requires-python = ">=3.11"
dependencies = []

```
</details>

## 📂 3. 核心目錄結構 (Core Structure)
_(💡 AI 讀取守則：請依據此結構尋找對應檔案，勿盲目猜測路徑)_
```text
workshift-landing/
├── AGENT_CONTEXT.md
├── BRAND.md
├── BRAND.pdf
├── DESIGN.md
├── README.md
├── Workshift-Brand-Bible.docx
├── Workshift_Landing_Page_Copy.docx
├── artifacts
│   ├── mockup-sandbox
│   │   ├── components.json
│   │   ├── index.html
│   │   ├── mockupPreviewPlugin.ts
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── src
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── newsletter_template.html
├── attached_assets
│   ├── ParticleSphere_1773418631481.jsx
│   ├── ParticleSphere_1773444812601.jsx
│   ├── Pasted-import-useState-useCallback-useEffect-useRef-from-react_1773449059946.txt
│   ├── Zrzut_ekranu_2026-03-13_o_18.28.15_1773422900936.png
│   ├── Zrzut_ekranu_2026-03-14_o_00.55.28_1773446131171.png
│   ├── Zrzut_ekranu_2026-03-14_o_18.50.57_1773510661032.png
│   ├── anthropic_1773510567979.png
│   ├── claude_1773511277306.png
│   ├── copilot_1773511277307.png
│   ├── deepseek_1773511277308.png
│   ├── grok_1773511277308.png
│   ├── lovable_1773510567980.png
│   ├── n8n_1773510567981.png
│   ├── openai_1773510567981.png
│   ├── perplexity_1773510567981.png
│   ├── replit_1773510567982.png
│   └── targeted_element_1773444031528.png
├── capture_verification.mjs
├── check_console.mjs
├── components.json
├── design-system-legacy.css
├── design-system.css
├── diary
│   └── 2026
│       └── 04
├── eslint.config.js
├── files
│   ├── workshift-layers-bg-1200x600.svg
│   └── workshift-signet-layers-animated.svg
├── files.zip
├── generate_brand_pdf.py
├── index.html
├── jsconfig.json
├── lint.txt
├── local_mobile_audit.png
├── main.py
├── mobile_after.png
├── package-lock.json
├── package.json
├── pre-shadcn-backup.zip
├── public
│   ├── Workshift_Brand_Assets.zip
│   ├── ai-icons
│   │   ├── adobefirefly.svg
│   │   ├── aistudio.svg
│   │   ├── anthropic.svg
│   │   ├── antigravity.svg
│   │   ├── claude.svg
│   │   ├── codex.svg
│   │   ├── comfyui.svg
│   │   ├── copilot.svg
│   │   ├── deepseek.svg
│   │   ├── gemini.svg
│   │   ├── grok.svg
│   │   ├── lovable.svg
│   │   ├── n8n.svg
│   │   ├── notebooklm.svg
│   │   ├── openai.svg
│   │   ├── perplexity.svg
│   │   └── replit.svg
│   ├── apple-touch-icon.png
│   ├── brand-assets
│   │   ├── README.md
│   │   ├── logo-dark.png
│   │   ├── logo-dark.svg
│   │   ├── logo-icon.png
│   │   ├── logo-icon.svg
│   │   ├── logo-light.png
│   │   ├── logo-light.svg
│   │   ├── render-assets.html
│   │   ├── render-logo-dark.html
│   │   ├── render-logo-icon.html
│   │   └── render-logo-light.html
│   ├── config.env.php
│   ├── config.env.php.example
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon-512x512.png
│   ├── favicon-96x96.png
│   ├── favicon.svg
│   ├── images
│   │   ├── blog
│   │   └── kreacje
│   ├── industry_ads_new.png
│   ├── industry_ecommerce_new.png
│   ├── industry_healthcare_new.png
│   ├── industry_hr_new.png
│   ├── industry_law_new.png
│   ├── industry_manufacturing_new.png
│   ├── industry_property_new.png
│   ├── robots.txt
│   ├── send_email.php
│   ├── site.webmanifest
│   ├── sitemap.xml
│   ├── subscribe_newsletter.php
│   ├── vite.svg
│   ├── web-app-manifest-192x192.png
│   └── web-app-manifest-512x512.png
├── pyproject.toml
├── replit.md
├── screenshot.js
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── Jakub-Bednarz.png
│   ├── assets
│   │   ├── bogdan-dzudzewicz-400.jpg
│   │   ├── bogdan-dzudzewicz-highres.jpg
│   │   ├── logos
│   │   ├── newsletter-bg.png
│   │   ├── partners
│   │   ├── react.svg
│   │   ├── tymoteusz-madry-400.jpg
│   │   ├── tymoteusz-madry-highres.jpg
│   │   ├── tymoteusz-madry.jpg
│   │   ├── zuzanna-wozniak-400.jpg
│   │   └── zuzanna-wozniak-highres.jpg
│   ├── components
│   │   ├── AboutUsSection.jsx
│   │   ├── AnimatedQuoteSection.jsx
│   │   ├── ContactSection.jsx
│   │   ├── DataMetricsSection.jsx
│   │   ├── FloatingWhatsApp.jsx
│   │   ├── FooterAndMisc.jsx
│   │   ├── GradientText.jsx
│   │   ├── Header.jsx
│   │   ├── HeroParticleSphere.jsx
│   │   ├── HeroTypographic.jsx
│   │   ├── IndustriesSection.jsx
│   │   ├── InteractiveServicesBento.jsx
│   │   ├── LenisProvider.jsx
│   │   ├── NewsletterSection.jsx
│   │   ├── PhoneMockupCard.jsx
│   │   ├── ProcessSection.jsx
│   │   ├── ScrollScatterSection.jsx
│   │   ├── TestimonialsSection.jsx
│   │   ├── animations
│   │   ├── blog
│   │   └── ui
│   ├── data
│   │   ├── blogPosts.js
│   │   └── services.js
│   ├── index.css
│   ├── layouts
│   ├── lib
│   │   ├── ogl
│   │   ├── ogl-install
│   │   └── utils.js
│   ├── main.jsx
│   ├── pages
│   │   ├── BlogListPage.jsx
│   │   ├── BlogPostPage.jsx
│   │   ├── PrivacyPolicyPage.jsx
│   │   ├── ServicePage.jsx
│   │   └── ThankYouPage.jsx
│   └── utils
│       ├── cn.js
│       └── webgl.js
├── vite.config.js
├── workshift-c1-parallelogram-export
│   ├── favicon-16px.png
│   ├── favicon-32.svg
│   ├── favicon-32px.png
│   ├── favicon-64px.png
│   ├── lockup-gradient-on-dark.png
│   ├── lockup-gradient-on-dark.svg
│   ├── lockup-gradient-on-light.png
│   ├── lockup-gradient-on-light.svg
│   ├── lockup-navy-on-light.png
│   ├── lockup-navy-on-light.svg
│   ├── lockup-white-on-dark.png
│   ├── lockup-white-on-dark.svg
│   ├── signet-gradient-on-dark-128px.png
│   ├── signet-gradient-on-dark-256px.png
│   ├── signet-gradient-on-dark-512px.png
│   ├── signet-gradient-on-dark-64px.png
│   ├── signet-gradient-on-dark.svg
│   ├── signet-gradient-on-light-128px.png
│   ├── signet-gradient-on-light-256px.png
│   ├── signet-gradient-on-light-512px.png
│   ├── signet-gradient-on-light-64px.png
│   ├── signet-gradient-on-light.svg
│   ├── signet-navy-on-light-128px.png
│   ├── signet-navy-on-light-256px.png
│   ├── signet-navy-on-light-512px.png
│   ├── signet-navy-on-light-64px.png
│   ├── signet-navy-on-light.svg
│   ├── signet-white-on-dark-128px.png
│   ├── signet-white-on-dark-256px.png
│   ├── signet-white-on-dark-512px.png
│   ├── signet-white-on-dark-64px.png
│   └── signet-white-on-dark.svg
└── workshift-c1-parallelogram-export.zip
```

## 🏛️ 4. 架構與設計約定 (Architecture & Conventions)
* _（尚無 `.auto-skill-local.md`，專案踩坑經驗將在開發過程中自動累積）_

## 🚦 5. 目前進度與待辦 (Current Status & TODO)
_(自動提取自最近日記 2026-04-21)_

### 🚧 待辦事項
- [ ] Monitor analytics for the new service subpages.
- [ ] Add more blog content to populate the list.
- [ ] Implement a full case study component for the "Klienci" section.

