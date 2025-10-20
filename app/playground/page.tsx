'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Playground Redirect
 *
 * This page redirects to the Developer Portal which has all playground features:
 * - Smart Contract IDE
 * - Code Playground
 * - Developer Sandbox
 * - API Explorer
 * - And much more!
 */
export default function PlaygroundRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Developer Portal (port 3005)
    window.location.href = 'http://localhost:3005';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0019ff] via-[#0019ff] to-[#0047ff] flex items-center justify-center text-white">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-4">
            <svg
              className="w-10 h-10 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3">Redirecting to Developer Portal</h1>
        <p className="text-blue-100 mb-6 max-w-md mx-auto">
          All playground features have been moved to the comprehensive Developer Portal
        </p>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Smart Contract IDE
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Code Playground
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Developer Sandbox
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            API Explorer
          </div>
        </div>

        <div className="mt-8">
          <a
            href="http://localhost:3005"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0019ff] rounded-lg font-semibold hover:bg-blue-50 transition-all"
          >
            Go to Developer Portal
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
