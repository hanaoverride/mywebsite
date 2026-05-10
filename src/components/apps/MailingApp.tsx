'use client';

import { useState, type FormEvent } from 'react';
import { useDesktopStore } from '@/store/desktop';
import { Mail, Loader2 } from 'lucide-react';

interface FormState {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

const initialState: FormState = { from_name: '', from_email: '', subject: '', message: '' };

export default function MailingApp() {
  const locale = useDesktopStore((s) => s.locale);
  const isKo = locale === 'ko';
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const t = {
    title: isKo ? '메일' : 'Mail',
    name: isKo ? '이름' : 'Name',
    email: isKo ? '이메일' : 'Email',
    subject: isKo ? '제목' : 'Subject',
    message: isKo ? '메시지' : 'Message',
    send: isKo ? '보내기' : 'Send',
    sending: isKo ? '전송 중...' : 'Sending...',
    success: isKo ? '메일이 전송되었습니다!' : 'Email sent successfully!',
    error: isKo ? '전송에 실패했습니다' : 'Failed to send',
    fallback: isKo ? '이메일 클라이언트 열기' : 'Open email client',
    nameRequired: isKo ? '이름을 입력해주세요' : 'Name is required',
    emailInvalid: isKo ? '올바른 이메일을 입력해주세요' : 'Please enter a valid email',
    subjectRequired: isKo ? '제목을 입력해주세요' : 'Subject is required',
    messageRequired: isKo ? '메시지를 입력해주세요' : 'Message is required',
    messageTooLong: isKo ? '메시지는 1000자 이내로 작성해주세요' : 'Message must be 1000 chars or less',
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.from_name.trim()) e.from_name = t.nameRequired;
    if (!form.from_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.from_email))
      e.from_email = t.emailInvalid;
    if (!form.subject.trim()) e.subject = t.subjectRequired;
    if (!form.message.trim()) e.message = t.messageRequired;
    if (form.message.length > 1000) e.message = t.messageTooLong;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm(initialState);
      } else if (data.fallback) {
        setStatus('error');
        setFallbackUrl(data.fallback);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
      setFallbackUrl(
        `mailto:hanaoverride@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`From: ${form.from_name} (${form.from_email})\n\n${form.message}`)}`,
      );
    }
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  return (
    <div className="h-full bg-gray-900 p-4 flex flex-col" data-testid="mailing-app">
      <div className="flex items-center gap-2 mb-4">
        <Mail size={20} className="text-blue-400" />
        <h2 className="text-white font-medium">{t.title}</h2>
      </div>
      {status === 'success' ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-green-400 text-center">{t.success}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-3">
          <div>
            <input
              type="text"
              placeholder={t.name}
              value={form.from_name}
              onChange={(e) => handleChange('from_name', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              data-testid="mail-name"
            />
            {errors.from_name && (
              <p className="text-red-400 text-xs mt-1" data-testid="mail-name-error">
                {errors.from_name}
              </p>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder={t.email}
              value={form.from_email}
              onChange={(e) => handleChange('from_email', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              data-testid="mail-email"
            />
            {errors.from_email && (
              <p className="text-red-400 text-xs mt-1" data-testid="mail-email-error">
                {errors.from_email}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder={t.subject}
              value={form.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              data-testid="mail-subject"
            />
            {errors.subject && (
              <p className="text-red-400 text-xs mt-1" data-testid="mail-subject-error">
                {errors.subject}
              </p>
            )}
          </div>
          <div className="flex-1">
            <textarea
              placeholder={t.message}
              value={form.message}
              onChange={(e) => handleChange('message', e.target.value)}
              className="w-full h-full min-h-[100px] bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              data-testid="mail-message"
            />
            {errors.message && (
              <p className="text-red-400 text-xs mt-1" data-testid="mail-message-error">
                {errors.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            data-testid="mail-submit"
          >
            {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
            {status === 'loading' ? t.sending : t.send}
          </button>
          {status === 'error' && (
            <div className="text-center">
              <p className="text-red-400 text-sm">{t.error}</p>
              {fallbackUrl && (
                <a
                  href={fallbackUrl}
                  className="text-blue-400 text-sm hover:underline mt-1 inline-block"
                  data-testid="mail-fallback"
                >
                  {t.fallback}
                </a>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
