import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>404</h1>
      <h2 style={{ marginBottom: "1rem" }}>Page Not Found</h2>
      <p style={{ marginBottom: "2rem", color: "#666" }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/login"
        style={{
          padding: "0.75rem 1.5rem",
          background: "#02203c",
          color: "white",
          borderRadius: "4px",
          textDecoration: "none",
        }}
      >
        Go to Login
      </Link>
    </div>
  );
}
