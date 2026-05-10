'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useDesktopStore } from '@/store/desktop';

interface HistoryEntry {
  type: 'command' | 'output' | 'error';
  text: string;
}

const BANNER = `Available commands: whoami, video, mail, browser, text, blackjack, exit`;

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
  const [input, setInput] = useState('');
  const [displayTime, setDisplayTime] = useState(getTimeStr());
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: BANNER },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const openApp = useDesktopStore((s) => s.openApp);
  const closeApp = useDesktopStore((s) => s.closeApp);

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
          addOutput('hanaoverride');
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
        case 'exit':
          addOutput('Terminal session ended.');
          setTimeout(() => closeApp('terminal'), 500);
          break;
        case 'love':
          addOutput(HEART_ART);
          break;
        case '':
          break;
        default:
          addError(`command not found: ${trimmed}`);
          break;
      }
    },
    [openApp, closeApp, addOutput, addError],
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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="h-full bg-[#2b2b2b] font-mono text-sm flex flex-col select-text"
      onClick={() => inputRef.current?.focus()}
      data-testid="terminal"
    >
      <div className="text-xs text-cyan-400 px-3 py-2 border-b border-gray-700/50 flex justify-between flex-shrink-0">
        <span>(base) ┌─(~)──(hanaoverride@hostname:pts/0)─┐</span>
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

        <div className="flex items-center">
          <span className="text-yellow-300 whitespace-pre">
            └─({displayTime})─❯{' '}
          </span>
          <span className="text-green-300">{input}</span>
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

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        autoFocus
        autoComplete="off"
        spellCheck={false}
        data-testid="terminal-input"
        aria-label="Terminal input"
      />
    </div>
  );
}
