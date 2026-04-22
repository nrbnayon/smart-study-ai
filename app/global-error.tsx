'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 font-sans p-6 text-center">
        <h2 className="text-4xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          A critical error occurred. We have been notified and are working on a fix.
        </p>
        <button
          onClick={() => reset()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
