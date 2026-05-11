'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDesktopStore } from '@/store/desktop';
import { motion } from 'framer-motion';

import { useTranslations } from 'next-intl';

interface CalendarPopoverProps {
  onClose: () => void;
}

export default function CalendarPopover({ onClose }: CalendarPopoverProps) {
  const t = useTranslations('desktop.panel.calendar');
  const locale = useDesktopStore((s) => s.locale);
  const [viewDate, setViewDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const today = new Date();

  const days = [];
  const totalDays = daysInMonth(currentYear, currentMonth);
  const firstDay = firstDayOfMonth(currentYear, currentMonth);

  // Pad previous month days
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Current month days
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const monthNames = t.raw('months');
  const weekDays = t.raw('weekdays');

  const monthName = monthNames[currentMonth];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className="absolute top-10 right-3 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 shadow-2xl z-50 w-72 select-none overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-tight">
              {monthName} {currentYear}
            </span>
            <span className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">
              {t('title')}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day: string, i: number) => (
            <div key={day} className={`text-center text-[10px] font-bold uppercase tracking-tighter ${i === 0 ? 'text-red-400/80' : i === 6 ? 'text-blue-400/80' : 'text-gray-500'}`}>
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const isToday = 
              day === today.getDate() && 
              currentMonth === today.getMonth() && 
              currentYear === today.getFullYear();
            
            const isWeekend = i % 7 === 0 || i % 7 === 6;

            return (
              <div
                key={i}
                className={`
                  h-8 flex items-center justify-center text-sm rounded-lg transition-all duration-200
                  ${day ? 'hover:bg-white/10 cursor-default' : ''}
                  ${isToday ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30' : 'text-gray-300'}
                  ${!isToday && isWeekend && day ? 'text-gray-400' : ''}
                  ${!day ? 'opacity-0' : 'opacity-100'}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Footer / Today shortcut */}
        <div className="mt-4 pt-3 border-t border-gray-700/30 flex items-center justify-between">
          <button 
            onClick={() => setViewDate(new Date())}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors px-2 py-1 rounded-md hover:bg-blue-400/10"
          >
            {t('today')}
          </button>
          <span className="text-[10px] text-gray-500 font-mono">
            {today.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </motion.div>
    </>
  );
}
