"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { checkInParticipant, type CheckInResult } from "@/lib/actions/checkin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, QrCode, Camera, AlertTriangle, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Result display ────────────────────────────────────────────────────────

function ResultCard({ result }: { result: CheckInResult }) {
  if (result.status === "success") {
    return (
      <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/20 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-700">Checked in ✓</p>
          <p className="text-sm text-emerald-600">{result.name ?? result.email}</p>
          <p className="text-xs text-emerald-500 mt-0.5">
            {new Date(result.checkedInAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  }

  if (result.status === "already_in") {
    return (
      <div className="p-4 rounded-xl border bg-amber-500/10 border-amber-500/20 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-700">Already checked in</p>
          <p className="text-sm text-amber-600">{result.name ?? result.email}</p>
          <p className="text-xs text-amber-500 mt-0.5">
            Checked in at {new Date(result.checkedInAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  }

  const messages: Record<string, string> = {
    invalid:         "Invalid QR code — ticket not found",
    unauthorized:    "You don't have permission to check in participants",
    unauthenticated: "You must be signed in to check in participants",
  };

  return (
    <div className="p-4 rounded-xl border bg-destructive/10 border-destructive/20 flex items-start gap-3">
      <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
      <p className="font-semibold text-destructive">
        {messages[result.status] ?? "Unknown error"}
      </p>
    </div>
  );
}

// ─── Camera scanner ────────────────────────────────────────────────────────

interface CameraScannerProps {
  onScan: (token: string) => void;
  active: boolean;
}

function CameraScanner({ onScan, active }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const readerRef = useRef<import("@zxing/browser").BrowserQRCodeReader | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const { BrowserQRCodeReader } = await import("@zxing/browser");
      const reader = new BrowserQRCodeReader();
      readerRef.current = reader;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setScanning(true);

        // Continuously decode frames
        const decode = async () => {
          if (!videoRef.current || !readerRef.current) return;
          try {
            const result = await readerRef.current.decodeOnceFromVideoElement(videoRef.current);
            if (result?.getText()) {
              onScan(result.getText());
              // Brief pause then resume scanning
              setTimeout(decode, 1500);
            }
          } catch {
            // No QR found in this frame — keep trying
            if (streamRef.current?.active) {
              setTimeout(decode, 300);
            }
          }
        };
        decode();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Camera access denied";
      setError(msg.includes("Permission") || msg.includes("NotAllowed")
        ? "Camera permission denied. Allow camera access and try again."
        : "Could not start camera. Try manual input instead.");
    }
  }, [onScan]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    readerRef.current = null;
    setScanning(false);
  }, []);

  useEffect(() => {
    if (active) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [active, startCamera, stopCamera]);

  if (error) {
    return (
      <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
      />
      {/* Scanning overlay */}
      {scanning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 border-2 border-primary rounded-xl relative">
            <span className="absolute -top-px left-4 right-4 h-0.5 bg-primary animate-scan" />
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br" />
          </div>
        </div>
      )}
      {!scanning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/70 text-sm">Starting camera...</p>
        </div>
      )}
    </div>
  );
}

// ─── Main scanner component ────────────────────────────────────────────────

export function CheckInScanner() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [inputMode, setInputMode] = useState<"manual" | "camera">("manual");
  const inputRef = useRef<HTMLInputElement>(null);

  function processToken(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    startTransition(async () => {
      try {
        const res = await checkInParticipant(trimmed);
        setResult(res);
        setToken("");
        setTimeout(() => inputRef.current?.focus(), 100);
      } catch {
        setResult({ status: "invalid" });
        toast.error("Network error — please try again");
      }
    });
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    processToken(token);
  }

  function handleCameraScan(scanned: string) {
    // Avoid processing the same token twice in quick succession
    if (isPending) return;
    processToken(scanned);
  }

  return (
    <div className="max-w-lg space-y-4">
      {/* Mode toggle */}
      <div className="flex rounded-xl border border-border bg-muted/50 p-1 gap-1">
        <button
          onClick={() => setInputMode("manual")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all",
            inputMode === "manual"
              ? "bg-card shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Keyboard className="w-4 h-4" />
          Manual input
        </button>
        <button
          onClick={() => setInputMode("camera")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all",
            inputMode === "camera"
              ? "bg-card shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Camera className="w-4 h-4" />
          Camera scan
        </button>
      </div>

      {/* Scanner card */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            {inputMode === "camera" ? (
              <Camera className="w-5 h-5 text-primary" />
            ) : (
              <QrCode className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {inputMode === "camera" ? "Camera Scanner" : "Manual Check-in"}
            </p>
            <p className="text-xs text-muted-foreground">
              {inputMode === "camera"
                ? "Point camera at participant's QR code"
                : "Paste or type the QR token from the participant's ticket"}
            </p>
          </div>
        </div>

        {inputMode === "manual" ? (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="token">QR Token</Label>
              <Input
                id="token"
                ref={inputRef}
                value={token}
                onChange={(e) => { setToken(e.target.value); setResult(null); }}
                placeholder="Paste token here..."
                className="font-mono"
                autoFocus
                disabled={isPending}
              />
            </div>
            <Button
              type="submit"
              disabled={isPending || !token.trim()}
              className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
            >
              {isPending ? "Checking in..." : "Check In"}
            </Button>
          </form>
        ) : (
          <div className="space-y-3">
            <CameraScanner
              onScan={handleCameraScan}
              active={inputMode === "camera"}
            />
            {isPending && (
              <p className="text-xs text-center text-muted-foreground animate-pulse">
                Processing...
              </p>
            )}
          </div>
        )}

        {/* Result */}
        {result && <ResultCard result={result} />}
      </div>
    </div>
  );
}
