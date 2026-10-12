"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Camera, Flashlight, RefreshCw, Zap } from "lucide-react";
import jsQR from "jsqr";

export default function Scanner() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [torch, setTorch] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  // Play subtle feedback beep on successful scan
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  const resolveCode = useCallback(async (raw: string) => {
    setErr("");
    playBeep();
    try {
      const res = await fetch(`/api/scan?code=${encodeURIComponent(raw.trim())}`);
      const d = await res.json();
      if (!res.ok) {
        setErr(d.error ?? `Asset "${raw}" not found in database.`);
        return;
      }
      router.push(`/scan/${d.token}`);
    } catch (e: any) {
      setErr("Failed to verify asset code. Check your connection.");
    }
  }, [router]);

  // Start Camera Stream
  useEffect(() => {
    let active = true;
    let animId: number;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setErr("Camera is not supported on this device/browser. Use manual entry.");
        return;
      }

      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Check if torch/flashlight is supported
        const track = stream.getVideoTracks()[0];
        const caps = (track?.getCapabilities ? track.getCapabilities() : {}) as any;
        setHasTorch(Boolean(caps?.torch));

        setCameraActive(true);
        setScanning(true);

        // Continuous Frame Scanner Loop
        const scanFrame = () => {
          if (!active) return;
          const video = videoRef.current;
          const canvas = canvasRef.current;

          if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (ctx) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const qr = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
              });

              if (qr && qr.data) {
                setScanning(false);
                resolveCode(qr.data);
                return;
              }
            }
          }

          animId = requestAnimationFrame(scanFrame);
        };

        animId = requestAnimationFrame(scanFrame);
      } catch (err: any) {
        console.error("Camera access error:", err);
        setCameraActive(false);
        setErr("Camera permission denied or camera in use. Please enter asset tag below.");
      }
    }

    startCamera();

    return () => {
      active = false;
      cancelAnimationFrame(animId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [facingMode, resolveCode]);

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;
    try {
      const next = !torch;
      await (track as any).applyConstraints({ advanced: [{ torch: next }] });
      setTorch(next);
    } catch {}
  };

  // Toggle Camera (Front/Back)
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video Viewfinder */}
      <div className="card overflow-hidden aspect-square bg-slate-950 relative border border-line shadow-2xl rounded-2xl flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          aria-label="Field Barcode & QR Camera Preview"
        />

        {/* High-tech Viewfinder HUD */}
        {cameraActive && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            {/* Corner Targeting Brackets */}
            <div className="relative w-64 h-64 border-2 border-accent/40 rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-accent rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-accent rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-accent rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-accent rounded-br-lg" />

              {/* Animated Laser Scanning Line */}
              {scanning && (
                <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_12px_#2dd4bf] animate-[bounce_2s_infinite]" />
              )}
            </div>

            <span className="mt-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur border border-line text-[11px] font-mono text-dim tracking-wider uppercase">
              Align QR Code or Barcode inside target
            </span>
          </div>
        )}

        {/* Viewfinder Controls (Torch & Flip) */}
        {cameraActive && (
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            {hasTorch && (
              <button
                type="button"
                onClick={toggleTorch}
                className={`p-2 rounded-full backdrop-blur border transition ${
                  torch
                    ? "bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_12px_#fbbf24]"
                    : "bg-slate-900/80 text-white border-line hover:bg-slate-800"
                }`}
                title="Toggle Flashlight / Torch"
              >
                <Flashlight className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={toggleFacingMode}
              className="p-2 rounded-full bg-slate-900/80 backdrop-blur border border-line text-white hover:bg-slate-800 transition"
              title="Switch Front / Rear Camera"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Camera Inactive Fallback Overlay */}
        {!cameraActive && (
          <div className="text-center p-6 space-y-2">
            <Camera className="h-10 w-10 text-dim mx-auto stroke-1" />
            <div className="text-xs text-mute font-mono">Camera preview paused or unavailable</div>
          </div>
        )}
      </div>

      {/* Manual Tag Lookup Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) resolveCode(code);
        }}
        className="card p-4 space-y-3"
      >
        <div>
          <label className="label" htmlFor="scanner-manual-code">
            Manual Asset Identifier or Barcode
          </label>
          <div className="flex gap-2">
            <input
              id="scanner-manual-code"
              className="input h-11 font-mono uppercase"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. ICT-LAG-004821"
              autoCapitalize="characters"
              required
            />
            <button type="submit" className="btn btn-primary h-11 px-5 shrink-0 flex items-center gap-1.5 font-bold">
              <Zap className="h-4 w-4" />
              Scan
            </button>
          </div>
        </div>

        {err && (
          <div role="alert" className="p-3 rounded-lg bg-bad/10 border border-bad/30 text-bad text-xs">
            {err}
          </div>
        )}
      </form>
    </div>
  );
}
