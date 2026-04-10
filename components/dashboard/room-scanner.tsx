"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { bookRoomForTeam, type RoomBookingResult } from "@/lib/actions/rooms";
import { CheckCircle, XCircle, AlertTriangle, Camera, Users, Mail } from "lucide-react";
import { toast } from "sonner";
import { formatLocalTime } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ─── Result display ────────────────────────────────────────────────────────

function ResultCard({ result }: { result: RoomBookingResult }) {
  if (result.status === "success") {
    return (
      <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/20 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-700">Room Booked Successfully!</p>
          <p className="text-sm text-emerald-600">{result.roomName}</p>
          <p className="text-xs text-emerald-500 mt-0.5">
            {formatLocalTime(result.bookedAt)}
          </p>
        </div>
      </div>
    );
  }

  if (result.status === "already_booked") {
    return (
      <div className="p-4 rounded-xl border bg-blue-500/10 border-blue-500/20 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-700">Already Booked</p>
          <p className="text-sm text-blue-600">Your team has already booked {result.roomName}</p>
        </div>
      </div>
    );
  }

  if (result.status === "room_full") {
    return (
      <div className="p-4 rounded-xl border bg-amber-500/10 border-amber-500/20 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-amber-700">Room Full</p>
          <p className="text-sm text-amber-600 mb-2">
            {result.roomName} is at capacity ({result.capacity} {result.capacity === 1 ? "team" : "teams"})
          </p>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-amber-700">Current Teams:</p>
            {result.currentBookings.map((booking, idx) => (
              <div key={idx} className="text-xs bg-amber-500/5 rounded p-2">
                <p className="font-medium text-amber-700">{booking.teamName}</p>
                <div className="flex items-center gap-1 text-amber-600 mt-0.5">
                  <Users className="w-3 h-3" />
                  <span>{booking.leaderName || "Team Leader"}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-600">
                  <Mail className="w-3 h-3" />
                  <span>{booking.leaderEmail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (result.status === "no_team") {
    return (
      <div className="p-4 rounded-xl border bg-amber-500/10 border-amber-500/20 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-700">No Team Found</p>
          <p className="text-sm text-amber-600">{result.message}</p>
        </div>
      </div>
    );
  }

  const messages: Record<string, string> = {
    invalid: "Invalid QR code — room not found",
    unauthorized: "You must be signed in to book a room",
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
                
                if (scannedText !== lastScanRef.current || now - lastScanTimeRef.current > 5000) {
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
        setError("Could not start camera. Please try again.");
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

export function RoomScanner() {
  const [result, setResult] = useState<RoomBookingResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const processingRef = useRef(false);
  const lastTokenRef = useRef<string>("");
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear result after 5 seconds with countdown
  useEffect(() => {
    if (result) {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      
      setCountdown(5);
      
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      clearTimeoutRef.current = setTimeout(() => {
        setResult(null);
        setCountdown(null);
        lastTokenRef.current = "";
      }, 5000);
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
    
    if (result) {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      setResult(null);
      setCountdown(null);
    }
    
    lastTokenRef.current = trimmed;
    processingRef.current = true;

    startTransition(async () => {
      try {
        const res = await bookRoomForTeam(trimmed);
        setResult(res);
        
        if (res.status === "success") {
          toast.success(`Room booked: ${res.roomName}`);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Camera className="w-4 h-4 mr-2" />
          Scan Hacking Space QR
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book Hacking Space</DialogTitle>
          <DialogDescription>
            Scan the QR code at your chosen hacking space to reserve it for your team
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <CameraScanner onScan={handleCameraScan} active={isOpen} />
          
          {isPending && (
            <p className="text-xs text-center text-muted-foreground animate-pulse">
              Processing...
            </p>
          )}

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
      </DialogContent>
    </Dialog>
  );
}
