export interface TechCategory {
  title: { ko: string; en: string };
  skills: { name: string; icon?: string }[];
}

export interface PortfolioData {
  hero: { name: { ko: string; en: string }; title: { ko: string; en: string }; tagline: { ko: string; en: string } };
  about: { ko: string; en: string };
  techStack: TechCategory[];
  projects: { title: string; description: { ko: string; en: string }; tech: string[]; link?: string }[];
  contact: { github?: string; linkedin?: string; email?: string };
}

export const portfolioData: PortfolioData = {
  hero: {
    name: { ko: 'hanaoverride', en: 'hanaoverride' },
    title: { ko: '풀스택 개발자', en: 'Full-Stack Developer' },
    tagline: { ko: '다재다능한 만능 개발자', en: 'Versatile All-Around Developer' },
  },
  about: {
    ko: '안녕하세요! 프론트엔드부터 백엔드, AI, 그리고 게임 개발까지 경계를 넘나드는 다재다능한 풀스택 개발자입니다. 복잡한 문제를 해결하기 위해 최적의 기술 스택을 유연하게 조합하며, 단순한 기능 구현을 넘어 사용자에게 깊은 영감을 주는 가치 있는 경험을 만드는 것을 지향합니다.',
    en: 'Hello! I am a versatile full-stack developer who crosses boundaries between frontend, backend, AI, and game development. I flexibly combine the optimal tech stack to solve complex problems, aiming to create valuable experiences that go beyond simple implementation to deeply inspire users.',
  },
  techStack: [
    {
      title: { ko: '프로그래밍 언어', en: 'Programming Languages' },
      skills: [
        { name: 'TypeScript' }, { name: 'Python' }, { name: 'Java' },
        { name: 'C#' }, { name: 'C++' },
      ],
    },
    {
      title: { ko: '프론트엔드', en: 'Frontend' },
      skills: [
        { name: 'React' }, { name: 'Next.js' }, { name: 'Flutter' },
        { name: 'Android' }, { name: 'Tailwind CSS' }, { name: 'Zustand' },
        { name: 'Vitest' }, { name: 'Playwright' },
      ],
    },
    {
      title: { ko: '백엔드', en: 'Backend' },
      skills: [
        { name: 'Node.js' }, { name: 'FastAPI' }, { name: 'Spring Boot' },
      ],
    },
    {
      title: { ko: '데이터베이스', en: 'Database' },
      skills: [
        { name: 'PostgreSQL' }, { name: 'MySQL' }, { name: 'SQLite' },
      ],
    },
    {
      title: { ko: '인프라 및 클라우드', en: 'Infrastructure & Cloud' },
      skills: [
        { name: 'AWS' }, { name: 'Docker' }, { name: 'Git' }, { name: 'Linux' },
      ],
    },
    {
      title: { ko: 'AI', en: 'AI' },
      skills: [
        { name: 'PyTorch' }, { name: 'LLM' }, { name: 'Computer Vision' },
        { name: 'Python' },
      ],
    },
    {
      title: { ko: '게임 개발', en: 'Game Development' },
      skills: [
        { name: 'Unity' }, { name: 'C#' }, { name: 'C++' },
      ],
    },
  ],
  projects: [
    {
      title: 'Linux Desktop Portfolio',
      description: {
        ko: 'Linux 데스크탑 GUI 형태의 인터랙티브 포트폴리오 웹사이트. 터미널, 브라우저, 메일 등 다양한 앱을 포함.',
        en: 'Interactive portfolio website in the form of a Linux desktop GUI. Includes terminal, browser, mail, and other apps.',
      },
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Docker'],
      link: 'https://github.com/hanaoverride/mywebsite',
    },
    {
      title: 'Landing Page Examples',
      description: {
        ko: 'GSAP와 Three.js를 활용한 고품질 랜딩 페이지 모음. 기업, 제품, 이벤트, 포트폴리오 등 4가지 테마의 시각적 비주얼 전략을 포함.',
        en: 'A collection of high-quality landing page examples using GSAP and Three.js. Includes visual strategies for 4 themes: Company, Product, Event, and Portfolio.',
      },
      tech: ['HTML/CSS/JS', 'Tailwind CSS v4', 'GSAP', 'Three.js', 'Playwright'],
      link: 'https://landingpgex.netlify.app/',
    },
    {
      title: 'Full-Stack RAG Web',
      description: {
        ko: 'LLM과 벡터 데이터베이스를 결합한 RAG(Retrieval-Augmented Generation) 기반 웹 애플리케이션. 문서 기반 질의응답 및 지식 추출 서비스 제공.',
        en: 'A RAG (Retrieval-Augmented Generation) based web application combining LLMs and vector databases. Provides document-based Q&A and knowledge extraction services.',
      },
      tech: ['Next.js', 'FastAPI', 'PostgreSQL', 'LangChain', 'OpenAI'],
    },
    {
      title: 'PDF OCR by LLM',
      description: {
        ko: 'EasyOCR과 LLM을 활용한 이미지 PDF 검색 최적화 파이프라인. OCR 오타를 AI로 교정하고 원본 PDF에 텍스트 레이어를 오버레이하여 검색 가능한 PDF 생성.',
        en: 'An image PDF search optimization pipeline using EasyOCR and LLM. Corrects OCR typos with AI and overlays a text layer on the original PDF to create searchable files.',
      },
      tech: ['Python', 'EasyOCR', 'OpenAI API', 'PyMuPDF', 'ReportLab'],
      link: 'https://github.com/hanaoverride/PDF-OCR-by-LLM',
    },
  ],
  contact: {
    github: 'https://github.com/hanaoverride',
    email: 'hanaoverride@gmail.com',
  },
};
