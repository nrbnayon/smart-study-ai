"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          color: "#111827",
          fontFamily: "sans-serif",
          padding: "24px",
          textAlign: "center",
          margin: 0,
        }}
      >
        <h2
          style={{
            fontSize: "2.25rem",
            fontWeight: 700,
            color: "#dc2626",
            marginBottom: "16px",
          }}
        >
          Something went wrong!
        </h2>
        <p
          style={{
            color: "#4b5563",
            marginBottom: "32px",
            maxWidth: "448px",
          }}
        >
          A critical error occurred. We have been notified and are working on a
          fix.
        </p>
        <button
          onClick={() => reset()}
          style={{
            backgroundColor: "#4f46e5",
            color: "#ffffff",
            padding: "12px 32px",
            borderRadius: "9999px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#4338ca")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#4f46e5")
          }
        >
          Try again
        </button>
      </body>
    </html>
  );
}
