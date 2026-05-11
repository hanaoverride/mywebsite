import { AppId } from '@/types/desktop';

export interface NavItem {
  id: string;
  icon: string;
  label: { ko: string; en: string };
  description: { ko: string; en: string };
  type: 'internal' | 'external';
  target: AppId | string;
}

export interface AboutContent {
  greeting: { ko: string; en: string };
  bio: { ko: string; en: string };
  highlights: { icon: string; label: { ko: string; en: string } }[];
}

export const navigationData: {
  about: AboutContent;
  links: NavItem[];
} = {
  about: {
    greeting: {
      ko: '반가워요, hanaoverride입니다! 👋',
      en: "Hi, I'm hanaoverride! 👋",
    },
    bio: {
      ko: '프론트엔드부터 AI까지, 기술의 경계를 넘나들며 가치 있는 경험을 만드는 풀스택 개발자입니다. 복잡한 문제를 단순하고 아름답게 해결하는 것을 즐깁니다.',
      en: 'I am a versatile full-stack developer bridging the gap between frontend and AI to create meaningful experiences. I enjoy solving complex problems simply and beautifully.',
    },
    highlights: [
      { icon: '🚀', label: { ko: '빠른 학습력', en: 'Fast Learner' } },
      { icon: '🎨', label: { ko: 'UI/UX 디자인 감각', en: 'UI/UX Focused' } },
      { icon: '🛠️', label: { ko: '문제 해결 중심', en: 'Problem Solver' } },
    ],
  },
  links: [
    {
      id: 'blog',
      icon: '✍️',
      label: { ko: '블로그', en: 'Blog' },
      description: { ko: '개발 지식과 일상을 기록하는 공간', en: 'Sharing development tips and daily life' },
      type: 'external',
      target: 'https://hanaoverride.github.io/',
    },
    {
      id: 'portfolio',
      icon: '📁',
      label: { ko: '포트폴리오', en: 'Portfolio' },
      description: { ko: '전체 포트폴리오 사이트 열기', en: 'Explore full portfolio projects' },
      type: 'internal',
      target: 'browser',
    },
    {
      id: 'github',
      icon: '🐙',
      label: { ko: 'GitHub', en: 'GitHub' },
      description: { ko: '소스 코드와 오픈소스 활동', en: 'Check out my repositories' },
      type: 'external',
      target: 'https://github.com/hanaoverride',
    },
    {
      id: 'contact',
      icon: '✉️',
      label: { ko: '연락하기', en: 'Contact' },
      description: { ko: '메일 앱을 통해 메시지 보내기', en: 'Send me a message via Mail' },
      type: 'internal',
      target: 'mail',
    },
  ],
};
