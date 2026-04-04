"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { checkInParticipant, type CheckInResult } from "@/lib/actions/checkin";
import { CheckCircle, XCircle, AlertTriangle, Camera } from "lucide-react";
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
  const scanningRef = useRef(false);
  const lastScanRef = useRef<string>("");
  const lastScanTimeRef = useRef<number>(0);

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
        scanningRef.current = true;

        // Continuously decode frames with proper loop
        const decode = async (): Promise<void> => {
          if (!scanningRef.current || !videoRef.current || !readerRef.current || !streamRef.current?.active) {
            return;
          }
          
          try {
            const result = await readerRef.current.decodeOnceFromVideoElement(videoRef.current);
            if (result?.getText()) {
              const scannedText = result.getText();
              const now = Date.now();
              
              // Prevent duplicate scans within 3 seconds
              if (scannedText !== lastScanRef.current || now - lastScanTimeRef.current > 3000) {
                lastScanRef.current = scannedText;
                lastScanTimeRef.current = now;
                onScan(scannedText);
              }
              
              // Continue scanning after a pause
              await new Promise(resolve => setTimeout(resolve, 2500));
            }
          } catch {
            // No QR found in this frame — keep trying
          }
          
          // Continue scanning
          if (scanningRef.current && streamRef.current?.active) {
            await new Promise(resolve => setTimeout(resolve, 150));
            decode();
          }
        };
        
        decode();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Camera access denied";
      setError(msg.includes("Permission") || msg.includes("NotAllowed")
        ? "Camera permission denied. Allow camera access and try again."
        : "Could not start camera. Try manual input instead.");
      setScanning(false);
      scanningRef.current = false;
    }
  }, [onScan]);

  const stopCamera = useCallback(() => {
    scanningRef.current = false;
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
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const processingRef = useRef(false);
  const lastTokenRef = useRef<string>("");

  function processToken(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed || processingRef.current) return;
    
    // Prevent duplicate processing
    if (trimmed === lastTokenRef.current) return;
    lastTokenRef.current = trimmed;
    processingRef.current = true;

    startTransition(async () => {
      try {
        const res = await checkInParticipant(trimmed);
        setResult(res);
      } catch {
        setResult({ status: "invalid" });
        toast.error("Network error — please try again");
      } finally {
        // Allow new scans after 2 seconds
        setTimeout(() => {
          processingRef.current = false;
        }, 2000);
      }
    });
  }

  function handleCameraScan(scanned: string) {
    processToken(scanned);
  }

  return (
    <div className="space-y-4">
      {/* Scanner card */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Camera className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Camera Scanner</p>
            <p className="text-xs text-muted-foreground">
              Point camera at participant's QR code
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <CameraScanner
            onScan={handleCameraScan}
            active={true}
          />
          {isPending && (
            <p className="text-xs text-center text-muted-foreground animate-pulse">
              Processing...
            </p>
          )}
        </div>

        {/* Result */}
        {result && <ResultCard result={result} />}
      </div>
    </div>
  );
}
