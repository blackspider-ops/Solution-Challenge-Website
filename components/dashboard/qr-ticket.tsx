"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, Clock, Download, Wallet, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface QRTicketProps {
  qrToken: string;
  name: string;
  email: string;
  status: string;
  checkedIn: boolean;
  checkedInAt?: Date | null;
}

export function QRTicket({ qrToken, name, email, status, checkedIn, checkedInAt }: QRTicketProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrReady, setQrReady] = useState(false);

  useEffect(() => {
    import("qrcode").then((QRCode) => {
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, qrToken, {
          width: 240,
          margin: 2,
          errorCorrectionLevel: "H", // highest — survives partial damage
          color: { dark: "#000000", light: "#ffffff" },
        });
        setQrReady(true);
      }
    }).catch(() => {
      // fallback: token shown as text
    });
  }, [qrToken]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `solution-challenge-ticket-${qrToken.slice(0, 8)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function handleAddToWallet() {
    // Generate wallet pass URL
    const walletUrl = `/api/wallet/pass?token=${qrToken}`;
    window.open(walletUrl, "_blank");
  }

  function handleEmailTicket() {
    // Trigger email resend
    toast.promise(
      fetch("/api/ticket/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).then((res) => res.json()),
      {
        loading: "Sending ticket to your email...",
        success: (data) => {
          if (data.success) {
            return "Ticket sent to your email!";
          }
          throw new Error(data.error || "Failed to send email");
        },
        error: "Failed to send email. Please try again.",
      }
    );
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="rounded-3xl border-2 border-border bg-card overflow-hidden shadow-xl">

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-center">
          <p className="text-primary-foreground/80 text-xs font-semibold uppercase tracking-widest mb-2">
            Solution Challenge 2026
          </p>
          <p className="text-primary-foreground text-xl font-bold leading-tight">{name}</p>
          <p className="text-primary-foreground/70 text-sm mt-1">{email}</p>
        </div>

        {/* QR Code */}
        <div className="p-8 flex flex-col items-center gap-4">
          <div className={`p-3 rounded-2xl bg-white border-2 shadow-sm transition-opacity ${qrReady ? "opacity-100" : "opacity-0"}`}>
            <canvas ref={canvasRef} />
          </div>
          {!qrReady && (
            <div className="w-[240px] h-[240px] rounded-xl bg-muted animate-pulse" />
          )}

          {/* Token text — for manual entry fallback */}
          <p className="text-xs text-muted-foreground font-mono break-all text-center px-2 select-all">
            {qrToken}
          </p>
        </div>

        {/* Status bar */}
        <div className="px-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Status</span>
            <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${
              status === "confirmed"
                ? "bg-emerald-500/10 text-emerald-700"
                : "bg-amber-500/10 text-amber-700"
            }`}>
              {status}
            </span>
          </div>

          {checkedIn ? (
            <div className="text-right">
              <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                <CheckCircle className="w-4 h-4" /> Checked In
              </span>
              {checkedInAt && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(checkedInAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              )}
            </div>
          ) : (
            <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Clock className="w-4 h-4" /> Not yet checked in
            </span>
          )}
        </div>

        {/* Actions */}
        {qrReady && (
          <div className="px-6 pb-6 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-2 text-muted-foreground"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEmailTicket}
                className="gap-2 text-muted-foreground"
              >
                <Mail className="w-3.5 h-3.5" />
                Email Me
              </Button>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={handleAddToWallet}
              className="w-full gap-2 bg-gradient-to-r from-primary to-primary/90"
            >
              <Wallet className="w-3.5 h-3.5" />
              Add to Wallet
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs text-center text-muted-foreground">
          Show this QR code at the event entrance. Screenshot or download it for offline use.
        </p>
      </div>
    </div>
  );
}

