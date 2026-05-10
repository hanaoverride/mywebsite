export interface PortfolioData {
  hero: { name: { ko: string; en: string }; title: { ko: string; en: string }; tagline: { ko: string; en: string } };
  about: { ko: string; en: string };
  techStack: { name: string; icon?: string }[];
  projects: { title: string; description: { ko: string; en: string }; tech: string[]; link?: string }[];
  contact: { github?: string; linkedin?: string; email?: string };
}

export const portfolioData: PortfolioData = {
  hero: {
    name: { ko: '하나 오버라이드', en: 'Hana Override' },
    title: { ko: '풀스택 개발자', en: 'Full-Stack Developer' },
    tagline: { ko: 'Linux 데스크탑에서 영감을 받은 포트폴리오', en: 'A portfolio inspired by the Linux desktop' },
  },
  about: {
    ko: '안녕하세요! 저는 사용자 경험과 깔끔한 코드를 중요하게 생각하는 개발자입니다. React, Next.js, TypeScript를 주로 사용하며, Linux와 오픈소스 문화를 사랑합니다.',
    en: 'Hi! I\'m a developer who values user experience and clean code. I mainly work with React, Next.js, and TypeScript, and I love Linux and open-source culture.',
  },
  techStack: [
    { name: 'React' }, { name: 'Next.js' }, { name: 'TypeScript' },
    { name: 'Tailwind CSS' }, { name: 'Zustand' }, { name: 'Node.js' },
    { name: 'Docker' }, { name: 'Git' }, { name: 'Linux' },
    { name: 'Vitest' }, { name: 'Playwright' },
  ],
  projects: [
    {
      title: 'Linux Desktop Portfolio',
      description: {
        ko: 'Linux 데스크탑 GUI 형태의 인터랙티브 포트폴리오 웹사이트. 터미널, 브라우저, 메일 등 다양한 앱을 포함.',
        en: 'Interactive portfolio website in the form of a Linux desktop GUI. Includes terminal, browser, mail, and other apps.',
      },
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Docker'],
    },
    {
      title: 'Project Alpha',
      description: {
        ko: '실시간 데이터 대시보드. WebSocket 기반 실시간 업데이트와 대화형 차트 제공.',
        en: 'Real-time data dashboard with WebSocket-based live updates and interactive charts.',
      },
      tech: ['React', 'Node.js', 'WebSocket', 'D3.js'],
    },
    {
      title: 'Project Beta',
      description: {
        ko: 'CLI 기반 개발자 도구. 코드 생성, 포맷팅, 린팅을 자동화.',
        en: 'CLI-based developer tool that automates code generation, formatting, and linting.',
      },
      tech: ['TypeScript', 'Node.js', 'Commander.js'],
    },
  ],
  contact: {
    github: 'https://github.com/hanaoverride',
    email: 'hanaoverride@gmail.com',
  },
};
