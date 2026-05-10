export default function DesktopWallpaper() {
  return (
    <div
      data-testid="desktop-wallpaper"
      className="fixed inset-0 z-0"
      style={{
        background: 'linear-gradient(180deg, #0a1628 0%, #0d2137 20%, #0f3460 45%, #16578a 65%, #1a8cba 80%, #1ca3c4 95%, #1cb5d4 100%)',
        backgroundSize: '100% 100%',
      }}
    >
      <svg className="absolute bottom-0 left-0 w-full opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#1ca3c4" d="M0,160 C360,260 720,100 1080,160 C1260,190 1380,210 1440,224 L1440,320 L0,320 Z" />
        <path fill="#1cb5d4" d="M0,192 C240,256 480,128 720,192 C960,256 1200,160 1440,192 L1440,320 L0,320 Z" />
        <path fill="#5dd9f2" d="M0,224 C300,288 600,160 900,224 C1080,272 1320,208 1440,224 L1440,320 L0,320 Z" />
      </svg>
    </div>
  );
}
