import React from 'react';
import dynamic from 'next/dynamic';

const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), { ssr: false });

interface RecaptchaProps {
  onChange: (token: string | null) => void;
}

export default function Recaptcha({ onChange }: RecaptchaProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    return (
      <div className="text-danger text-sm">reCAPTCHA site key missing. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY.</div>
    );
  }

  return (
    <div className="my-4">
      <ReCAPTCHA sitekey={siteKey} onChange={onChange} />
    </div>
  );
}
