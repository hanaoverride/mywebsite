'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useDesktopStore } from '@/store/desktop';
import type { WindowState } from '@/types/desktop';

interface AppWindowProps {
  window: WindowState;
  children: ReactNode;
}

export default function AppWindow({ window: win, children }: AppWindowProps) {
  const focusApp = useDesktopStore((s) => s.focusApp);
  const closeApp = useDesktopStore((s) => s.closeApp);
  const minimizeApp = useDesktopStore((s) => s.minimizeApp);
  const maximizeApp = useDesktopStore((s) => s.maximizeApp);
  const moveWindow = useDesktopStore((s) => s.moveWindow);
  const resizeWindow = useDesktopStore((s) => s.resizeWindow);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    startWinX: number;
    startWinY: number;
  } | null>(null);
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);

  useEffect(() => {
    isDraggingRef.current = isDragging;
    isResizingRef.current = isResizing;
  }, [isDragging, isResizing]);

  const handleTitleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (win.maximized) return;
      e.stopPropagation();
      focusApp(win.id);
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWinX: win.x,
        startWinY: win.y,
      };
    },
    [win.id, win.x, win.y, win.maximized, focusApp],
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setIsResizing(true);
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startW: win.width,
        startH: win.height,
      };
    },
    [win.width, win.height],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current && dragRef.current) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        const newX = Math.max(
          0,
          Math.min(window.innerWidth - 200, dragRef.current.startWinX + dx),
        );
        const newY = Math.max(
          32,
          Math.min(window.innerHeight - 60, dragRef.current.startWinY + dy),
        );
        moveWindow(win.id, newX, newY);
      }
      if (isResizingRef.current && resizeRef.current) {
        const dx = e.clientX - resizeRef.current.startX;
        const dy = e.clientY - resizeRef.current.startY;
        const newW = Math.max(300, resizeRef.current.startW + dx);
        const newH = Math.max(200, resizeRef.current.startH + dy);
        resizeWindow(win.id, newW, newH);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      dragRef.current = null;
      resizeRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [win.id, moveWindow, resizeWindow]);

  return (
    <motion.div
      data-testid={`window-${win.id}`}
      initial={{ opacity: 0, scale: 0.9, y: 20, left: win.x, top: win.y }}
      animate={win.minimized ? {
        opacity: 0,
        scale: 0,
        top: '100%',
        pointerEvents: 'none' as const,
      } : {
        opacity: 1,
        scale: 1,
        y: 0,
        left: win.maximized ? 0 : win.x,
        top: win.maximized ? 32 : win.y,
        width: win.maximized ? '100%' : win.width,
        height: win.maximized ? 'calc(100% - 32px - 56px)' : win.height,
        pointerEvents: 'auto' as const,
      }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={
        isDragging || isResizing
          ? { duration: 0 }
          : {
              type: 'spring',
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }
      }

      className="absolute flex flex-col rounded-lg overflow-hidden shadow-2xl shadow-black/50 border border-gray-700/50"
      style={{
        zIndex: win.zIndex,
      }}
      onMouseDown={() => focusApp(win.id)}
    >

      {/* Title bar */}
      <div
        className={`flex items-center h-8 bg-gray-900/95 px-2 select-none flex-shrink-0 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleTitleMouseDown}
        data-testid={`titlebar-${win.id}`}
      >
        {/* Window control buttons */}
        <div className="flex items-center -ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeApp(win.id);
            }}
            className="group w-8 h-8 flex items-center justify-center"
            aria-label="Close"
            data-testid={`close-${win.id}`}
          >
            <div className="w-3 h-3 rounded-full bg-red-500 group-hover:bg-red-400 group-active:bg-red-600 transition-all duration-200 group-hover:scale-110 group-active:scale-90 shadow-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeApp(win.id);
            }}
            className="group w-8 h-8 flex items-center justify-center"
            aria-label="Minimize"
            data-testid={`minimize-${win.id}`}
          >
            <div className="w-3 h-3 rounded-full bg-yellow-500 group-hover:bg-yellow-400 group-active:bg-yellow-600 transition-all duration-200 group-hover:scale-110 group-active:scale-90 shadow-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeApp(win.id);
            }}
            className="group w-8 h-8 flex items-center justify-center"
            aria-label="Maximize"
            data-testid={`maximize-${win.id}`}
          >
            <div className="w-3 h-3 rounded-full bg-green-500 group-hover:bg-green-400 group-active:bg-green-600 transition-all duration-200 group-hover:scale-110 group-active:scale-90 shadow-sm" />
          </button>
        </div>
        <span className="flex-1 text-center text-xs text-gray-400 font-medium truncate mx-2">
          {win.title}
        </span>
        {/* Spacer for visual symmetry with button area - 88px total (80px spacer + 8px padding) */}
        <div className="w-20 flex-shrink-0" />
      </div>

      {/* Content area */}
      <div className="flex-1 bg-gray-900 overflow-auto">{children}</div>

      {/* Resize handle — hidden when maximized */}
      {!win.maximized && (
        <div
          data-testid={`resize-${win.id}`}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </motion.div>
  );
}

