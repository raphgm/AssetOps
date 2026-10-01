"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

declare global { interface Window { BarcodeDetector?: new (o: { formats: string[] }) => { detect: (v: HTMLVideoElement) => Promise<{ rawValue: string }[]> } } }

export default function Scanner() {
  const r = useRouter(); const video = useRef<HTMLVideoElement>(null);
  const [err, setErr] = useState(""); const [supported, setSupported] = useState(true); const [code, setCode] = useState("");
  useEffect(() => {
    if (!window.BarcodeDetector || !navigator.mediaDevices?.getUserMedia) { setSupported(false); return; }
    let stop = false; let stream: MediaStream | undefined;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (video.current) { video.current.srcObject = stream; await video.current.play(); }
        const det = new window.BarcodeDetector!({ formats: ["qr_code"] });
        while (!stop) {
          const found = video.current ? await det.detect(video.current).catch(() => []) : [];
          if (found[0]) { resolve(found[0].rawValue); return; }
          await new Promise((res) => setTimeout(res, 300));
        }
      } catch { setErr("Camera unavailable. Enter the asset ID or code below."); setSupported(false); }
    })();
    return () => { stop = true; stream?.getTracks().forEach((t) => t.stop()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function resolve(raw: string) {
    setErr("");
    const res = await fetch(`/api/scan?code=${encodeURIComponent(raw.trim())}`); const d = await res.json();
    if (!res.ok) { setErr(d.error ?? "Not found"); return; }
    r.push(`/scan/${d.token}`);
  }
  return (
    <div className="max-w-md mx-auto space-y-4">
      {supported && <div className="card overflow-hidden aspect-square bg-black relative"><video ref={video} className="w-full h-full object-cover" muted playsInline aria-label="Camera preview" /><div className="absolute inset-10 border-2 border-accent/70 rounded-lg pointer-events-none" /></div>}
      <form onSubmit={(e) => { e.preventDefault(); resolve(code); }} className="card p-4 space-y-2">
        <label className="label" htmlFor="code">{supported ? "Or enter an asset ID" : "Enter asset ID or paste scan link"}</label>
        <input id="code" className="input h-11" value={code} onChange={(e) => setCode(e.target.value)} placeholder="ICT-LAG-004821" autoCapitalize="characters" required />
        <button className="btn btn-accent w-full h-11">Open asset</button>
        {err && <p role="alert" className="text-bad text-xs">{err}</p>}
      </form>
    </div>
  );
}
