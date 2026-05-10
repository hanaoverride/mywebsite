# 🖥️ Hana's Portfolio - Linux Inspired Desktop

> 내 데스크탑 환경을 웹으로 옮겨온 듯한, 프리미엄 글래스모피즘 스타일의 포트폴리오 웹사이트입니다.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

---

## ✨ 주요 특징 (Key Features)

### 🌊 프리미엄 디자인 & 글래스모피즘
- **Glassmorphism Dock**: 하단 도크(Dock)는 반투명한 유리 질감을 극대화하여 현대적이고 세련된 디자인을 제공합니다.
- **Dynamic Live Wallpaper**: `Canvas`를 활용한 실시간 애니메이션 배경화면이 몰입감 있는 사용자 경험을 선사합니다.
- **Dark Mode Optimization**: 모든 요소는 다크 모드에 최적화되어 눈의 피로를 덜어주며 고급스러운 분위기를 연출합니다.

### 🪟 고도화된 윈도우 매니지먼트
- **Multi-Windowing**: 실제 운영체제처럼 여러 개의 앱을 동시에 열고 조작할 수 있습니다.
- **Minimize / Maximize / Drag**: 창 최소화, 최대화, 드래그를 통한 자유로운 위치 이동이 가능합니다.
- **Staggered Opening**: 새로운 창이 열릴 때 겹치지 않게 지그재그로 배치되는 UX를 구현했습니다.

### 🛠️ 내장 애플리케이션 (Built-in Apps)
- **하나의 포트폴리오 (Web Browser)**: 웹 브라우저 형태로 구현된 메인 포트폴리오 페이지.
- **텍스트 뷰어 (Text Viewer)**: 마크다운 기반의 자기소개 및 상세 경력 기술서.
- **블랙잭 (Blackjack)**: 미니 게임을 통해 인터랙티브한 요소 추가.
- **비디오 플레이어 (Video Player)**: 멀티미디어 재생 기능.
- **터미널 (Terminal)**: CLI 환경을 모방한 터미널 인터페이스.

### 🌍 스마트 시스템 기능
- **i18n 지원**: 한국어(KO) 및 영어(EN)를 완벽하게 지원합니다.
- **실시간 날씨**: 부산 광안리(Gwangalli)의 실시간 날씨 정보를 API로 연동하여 표시합니다.
- **색온도 조절 (Color Temperature)**: 사용자의 환경에 맞춰 화면의 색온도를 조절할 수 있는 기능을 제공합니다.
- **절전 모드 (Sleep Mode)**: 실제 PC처럼 절전 모드와 로그인 시퀀스를 구현했습니다.

---

## 🛠️ 기술 스택 (Tech Stack)

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **State** | Zustand |
| **Animation** | Framer Motion |
| **Styling** | Vanilla CSS (Module), PostCSS |
| **Localization** | next-intl |
| **Icons** | Lucide React |

---

## 🚀 시작하기 (Getting Started)

### 사전 준비 (Prerequisites)
- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행
```bash
# 저장소 복제
git clone https://github.com/your-username/mywebsite.git

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

---

## 📂 프로젝트 구조 (Project Structure)

```text
src/
├── app/            # Next.js App Router (Layout, Pages)
├── components/     # UI Components (Desktop, Window, Apps)
├── store/          # Zustand State Management (Desktop Store)
├── styles/         # Global Styles & CSS Modules
├── types/          # TypeScript Type Definitions
└── messages/       # i18n Translation Files (KO, EN)
```

---

## 📜 라이선스 (License)

본 프로젝트는 **MIT License**를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

---

Designed & Developed with ❤️ by **Hana**

