"use client"

export default function WhatsAppFloat() {
  const WHATSAPP_LINK =
    "https://wa.me/8801973346401?text=Hello%20"

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        background: "#25D366",
        color: "#fff",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "28px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 9999,
        textDecoration: "none",
      }}
    >
      💬
    </a>
  )
}