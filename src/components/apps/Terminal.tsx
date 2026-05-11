'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useDesktopStore } from '@/store/desktop';
import { useTranslations } from 'next-intl';
import { useIsMobile } from '@/hooks/useIsMobile';

interface HistoryEntry {
  type: 'command' | 'output' | 'error';
  text: string;
}

const HEART_ART = `  ****     ****
  ******   ******
 ******** ********
 *****************
  ***************
   *************
    ***********
     *********
      *******
       *****
        ***
         *`;

function getTimeStr(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

export default function Terminal() {
  const t = useTranslations('apps.terminal');
  const [input, setInput] = useState('');
  const [displayTime, setDisplayTime] = useState(getTimeStr());
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: t('commands') },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const openApp = useDesktopStore((s) => s.openApp);
  const closeApp = useDesktopStore((s) => s.closeApp);
  const focusedApp = useDesktopStore((s) => s.focusedApp);

  useEffect(() => {
    const interval = setInterval(() => setDisplayTime(getTimeStr()), 1000);
    return () => clearInterval(interval);
  }, []);

  const addOutput = useCallback((text: string) => {
    setHistory((h) => [...h, { type: 'output', text }]);
  }, []);

  const addError = useCallback((text: string) => {
    setHistory((h) => [...h, { type: 'error', text }]);
  }, []);

  const execute = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      const execTime = getTimeStr();

      setHistory((h) => [
        ...h,
        { type: 'command', text: `└─(${execTime})─❯ ${trimmed}` },
      ]);
      setCmdHistory((h) => [...h, trimmed]);
      setHistoryIdx(-1);

      switch (trimmed.toLowerCase()) {
        case 'whoami':
          addOutput(t('whoami'));
          break;
        case 'video':
          addOutput('Opening Video Player...');
          openApp('video');
          break;
        case 'mail':
          addOutput('Opening Mail...');
          openApp('mail');
          break;
        case 'browser':
          addOutput('Opening Web Browser...');
          openApp('browser');
          break;
        case 'text':
          addOutput('Opening Text Viewer...');
          openApp('textviewer');
          break;
        case 'blackjack':
          addOutput('Opening Blackjack...');
          openApp('blackjack');
          break;
        case 'guide':
        case 'onboarding':
          addOutput('Opening Onboarding Guide...');
          openApp('onboarding');
          break;
        case 'nav':
        case 'navigator':
          addOutput('Opening Navigation Hub...');
          openApp('navigator');
          break;
        case 'exit':
          addOutput(t('exitMessage'));
          setTimeout(() => closeApp('terminal'), 500);
          break;
        case 'love':
          addOutput(HEART_ART);
          break;
        case '':
          break;
        default:
          addError(t('notFound', { cmd: trimmed }));
          break;
      }
    },
    [openApp, closeApp, addOutput, addError, t],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      execute(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIdx =
          historyIdx === -1
            ? cmdHistory.length - 1
            : Math.max(0, historyIdx - 1);
        setHistoryIdx(newIdx);
        setInput(cmdHistory[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const newIdx = historyIdx + 1;
        if (newIdx >= cmdHistory.length) {
          setHistoryIdx(-1);
          setInput('');
        } else {
          setHistoryIdx(newIdx);
          setInput(cmdHistory[newIdx]);
        }
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (focusedApp === 'terminal') {
      inputRef.current?.focus();
    }
  }, [focusedApp]);

  useEffect(() => {
    // Only auto-focus on non-mobile to avoid keyboard pop-up on page load
    if (!isMobile) {
      inputRef.current?.focus();
    }
  }, [isMobile]);

  return (
    <div
      className="h-full bg-[#2b2b2b] font-mono text-sm flex flex-col select-text"
      onClick={() => inputRef.current?.focus()}
      data-testid="terminal"
    >
      <div className="text-xs text-cyan-400 px-3 py-2 border-b border-gray-700/50 flex justify-between flex-shrink-0">
        <span>{isMobile ? 'hana@mobile:~' : '(base) ┌─(~)──(hanaoverride@hostname:pts/0)─┐'}</span>
        <span>{displayTime}</span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-auto px-3 py-1"
        data-testid="terminal-output"
      >
        {history.map((entry, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap break-all ${
              entry.type === 'command'
                ? 'text-yellow-300'
                : entry.type === 'error'
                  ? 'text-red-400'
                  : 'text-green-300'
            }`}
          >
            {entry.text}
          </div>
        ))}

        <div className="flex items-center flex-wrap">
          <span className="text-yellow-300 whitespace-pre">
            {isMobile ? '❯ ' : `└─(${displayTime})─❯ `}
          </span>
          <span className="text-green-300 break-all">{input}</span>
          <span
            className="inline-block w-2 h-[1.1em] bg-green-400 ml-px align-middle"
            data-testid="terminal-cursor"
            style={{
              animation: 'terminal-blink 0.5s step-end infinite',
            }}
          />
        </div>

        <style>{`
          @keyframes terminal-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </div>

      {isMobile && (
        <div className="p-2 bg-[#1e1e1e] border-t border-gray-700 flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-base focus:outline-none focus:border-cyan-500"
            placeholder={t('commands')}
            autoComplete="off"
            spellCheck={false}
          />
          <button 
            onClick={() => {
              execute(input);
              setInput('');
            }}
            className="bg-cyan-600 px-4 py-2 rounded text-white font-bold active:bg-cyan-700"
          >
            Go
          </button>
        </div>
      )}

      {!isMobile && (
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (focusedApp === 'terminal') {
              setTimeout(() => inputRef.current?.focus(), 10);
            }
          }}
          className="absolute opacity-0 w-px h-px pointer-events-none left-[-1000px] top-[-1000px]"
          autoFocus
          autoComplete="off"
          spellCheck={false}
          data-testid="terminal-input"
          aria-label="Terminal input"
        />
      )}
    </div>
  );
}
