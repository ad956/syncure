"use client";
import { Button, Card } from "@nextui-org/react";
import domtoimage from "dom-to-image";
import { useQRCode } from "next-qrcode";

import React from "react";
import { MdOutlineFileDownload } from "react-icons/md";

interface QRCodeProp {
  text: string;
}

export default function QRCode({ text }: QRCodeProp) {
  const { SVG } = useQRCode();

  const handleDownloadCard = () => {
    const cardElement = document.getElementById("qr-code-card");

    if (cardElement) {
      domtoimage
        .toPng(cardElement)
        .then((dataUrl: string) => {
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = "card.png"; // Set the filename for the downloaded file
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        })
        .catch((error: any) => {
          console.error("Error downloading card:", error);
        });
    } else {
      console.error("Card element not found.");
    }
  };
  return (
    <div className="flex flex-col items-center">
      <div
        id="qr-code-card"
        className="bg-white p-3 rounded-lg shadow-sm mb-3"
      >
        <SVG
          text={text}
          options={{
            margin: 1,
            width: 100,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          }}
        />
      </div>
      <Button
        size="sm"
        variant="flat"
        className="bg-blue-50 text-blue-600 hover:bg-blue-100"
        startContent={<MdOutlineFileDownload size={16} />}
        onClick={handleDownloadCard}
      >
        Download
      </Button>
    </div>
  );
}
