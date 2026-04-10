"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { distributeFoodToParticipant, type FoodDistributionResult, type MealType } from "@/lib/actions/food";
import { CheckCircle, XCircle, AlertTriangle, Camera, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { formatLocalTime } from "@/lib/format-date";

// ─── Result display ────────────────────────────────────────────────────────

function ResultCard({ result }: { result: FoodDistributionResult }) {
  if (result.status === "success") {
    const isSecondServing = result.servingNumber === 2;
    return (
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        isSecondServing 
          ? "bg-blue-500/10 border-blue-500/20" 
          : "bg-emerald-500/10 border-emerald-500/20"
      }`}>
        <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
          isSecondServing ? "text-blue-600" : "text-emerald-600"
        }`} />
        <div>
          <p className={`font-semibold ${isSecondServing ? "text-blue-700" : "text-emerald-700"}`}>
            {result.mealType} - {isSecondServing ? "Second Serving" : "First Serving"} ✓
          </p>
          <p className={`text-sm ${isSecondServing ? "text-blue-600" : "text-emerald-600"}`}>
            {result.name ?? result.email}
          </p>
          <p className={`text-xs mt-0.5 ${isSecondServing ? "text-blue-500" : "text-emerald-500"}`}>
            {formatLocalTime(result.distributedAt)}
          </p>
        </div>
      </div>
    );
  }

  if (result.status === "not_checked_in") {
    return (
      <div className="p-4 rounded-xl border bg-amber-500/10 border-amber-500/20 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-700">Not checked in</p>
          <p className="text-sm text-amber-600">{result.name ?? result.email}</p>
          <p className="text-xs text-amber-500 mt-0.5">
            Participant must check in first before receiving food
          </p>
        </div>
      </div>
    );
  }

  if (result.status === "second_serving_disabled") {
    return (
      <div className="p-4 rounded-xl border bg-amber-500/10 border-amber-500/20 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-700">Second serving not allowed</p>
          <p className="text-xs text-amber-500 mt-0.5">
            This participant has already received this meal. Second servings are currently disabled.
          </p>
        </div>
      </div>
    );
  }

  const messages: Record<string, string> = {
    invalid:         "Invalid QR code — ticket not found",
    unauthorized:    "You don't have permission to distribute food",
    unauthenticated: "You must be signed in to distribute food",
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
  const onScanRef = useRef(onScan);
  const decodeLoopRef = useRef<number | null>(null);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  const startCamera = useCallback(async () => {
    if (scanningRef.current && streamRef.current?.active) {
      return;
    }

    setError(null);
    setScanning(false);
    
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
        
        try {
          await videoRef.current.play();
        } catch (playError) {
          console.error("Video play error:", playError);
          throw new Error("Could not start video playback");
        }
        
        setScanning(true);
        scanningRef.current = true;

        const decode = () => {
          if (!scanningRef.current || !videoRef.current || !readerRef.current || !streamRef.current?.active) {
            return;
          }
          
          readerRef.current.decodeOnceFromVideoElement(videoRef.current)
            .then((result) => {
              if (result?.getText()) {
                const scannedText = result.getText();
                const now = Date.now();
                
                if (scannedText !== lastScanRef.current || now - lastScanTimeRef.current > 3000) {
                  lastScanRef.current = scannedText;
                  lastScanTimeRef.current = now;
                  onScanRef.current(scannedText);
                }
              }
            })
            .catch(() => {})
            .finally(() => {
              if (scanningRef.current && streamRef.current?.active) {
                decodeLoopRef.current = window.setTimeout(decode, 150);
              }
            });
        };
        
        decode();
      }
    } catch (e) {
      console.error("Camera error:", e);
      const msg = e instanceof Error ? e.message : "Camera access denied";
      
      if (msg.includes("Permission") || msg.includes("NotAllowed") || msg.includes("permission")) {
        setError("Camera permission denied. Allow camera access and try again.");
      } else if (msg.includes("NotFound") || msg.includes("not found")) {
        setError("No camera found. Please ensure your device has a camera.");
      } else if (msg.includes("NotReadable") || msg.includes("in use")) {
        setError("Camera is in use by another application. Please close other apps and try again.");
      } else {
        setError("Could not start camera. Please try again or use manual input.");
      }
      
      setScanning(false);
      scanningRef.current = false;
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    scanningRef.current = false;
    
    if (decodeLoopRef.current) {
      clearTimeout(decodeLoopRef.current);
      decodeLoopRef.current = null;
    }
    
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
      <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4">
        <p className="text-sm text-destructive mb-3">{error}</p>
        <button
          onClick={() => {
            setError(null);
            stopCamera();
            setTimeout(() => startCamera(), 100);
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Retry Camera
        </button>
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

export function FoodScanner({ mealType }: { mealType: MealType }) {
  const [result, setResult] = useState<FoodDistributionResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [countdown, setCountdown] = useState<number | null>(null);
  const processingRef = useRef(false);
  const lastTokenRef = useRef<string>("");
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear result after 10 seconds with countdown
  useEffect(() => {
    if (result) {
      // Clear any existing timeouts
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      
      // Start countdown from 10
      setCountdown(10);
      
      // Update countdown every second
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Set timeout to clear result after 10 seconds
      clearTimeoutRef.current = setTimeout(() => {
        setResult(null);
        setCountdown(null);
        lastTokenRef.current = ""; // Allow rescanning the same QR code
      }, 10000);
    }

    return () => {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [result]);

  function processToken(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed || processingRef.current) return;
    
    if (trimmed === lastTokenRef.current) return;
    lastTokenRef.current = trimmed;
    processingRef.current = true;

    startTransition(async () => {
      try {
        const res = await distributeFoodToParticipant(trimmed, mealType);
        setResult(res);
        
        if (res.status === "success") {
          toast.success(`Food distributed - ${res.servingNumber === 2 ? "Second" : "First"} serving`);
        }
      } catch {
        setResult({ status: "invalid" });
        toast.error("Network error — please try again");
      } finally {
        setTimeout(() => {
          processingRef.current = false;
        }, 2000);
      }
    });
  }

  function handleCameraScan(scanned: string) {
    processToken(scanned);
  }

  const mealLabels: Record<MealType, string> = {
    dinner: "Dinner",
    midnight_snack: "Midnight Snack",
    breakfast: "Breakfast",
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{mealLabels[mealType]} Scanner</p>
            <p className="text-xs text-muted-foreground">
              Scan participant's QR code to distribute food
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

        {result && (
          <div className="relative">
            <ResultCard result={result} />
            {countdown !== null && (
              <div className="absolute top-2 right-2">
                <div className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center">
                  <span className="text-xs font-semibold text-muted-foreground">{countdown}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
