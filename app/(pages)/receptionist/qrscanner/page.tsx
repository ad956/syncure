"use client";

import React, { useRef } from "react";
import QrScanner from "qr-scanner";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import scanQRCode from "@lib/receptionist/scan-qr-code";

// todo : search on based on mobile as well
export const dynamic = 'force-dynamic';

const QRScanner = () => {
  const [scanResult, setScanResult] = React.useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  const handleScan = (result: string) => {
    setScanResult(result);
  };

  const startScan = () => {
    if (videoRef.current) {
      qrScannerRef.current = new QrScanner(videoRef.current, handleScan);
      qrScannerRef.current.start();
    }
  };

  const stopScan = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current = null;
    }
  };

  React.useEffect(() => {
    if (scanResult) {
      (async () => {
        const res = await scanQRCode(scanResult);
        toast.success(res.message, { position: "bottom-center" });
      })();
    }
  }, [scanResult]);

  return (
    <div className="bg-[#f3f6fd] p-2 h-full">
      <Card className="h-full w-full flex flex-col items-center justify-center">
        <CardHeader className="pt-2 px-4 flex-col items-start gap-2 self-start max-w-sm">
          <h4 className="font-bold text-large">Scan QR Code</h4>
          <p className="text-tiny uppercase font-bold">
            Scan the patients, to add them to waiting list.
          </p>
        </CardHeader>

        <CardBody className="flex flex-col justify-center items-center w-4/5 h-4/5 m-5">
          <video
            id="video"
            ref={videoRef}
            className="rounded-xl h-4/5 w-3/5 border-2 border-gray-500"
          />
        </CardBody>

        <div className="mb-4">
          <Button
            onClick={startScan}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Scan
          </Button>
          <Button
            onClick={stopScan}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Stop Scan
          </Button>
        </div>
      </Card>
      <Toaster />
    </div>
  );
};

export default QRScanner;
