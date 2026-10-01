"use client";
import { useRouter } from "next/navigation";
export default function MarkRead() { const r = useRouter(); return <button className="btn" onClick={async () => { await fetch("/api/notifications", { method: "POST" }); r.refresh(); }}>Mark all read</button>; }
