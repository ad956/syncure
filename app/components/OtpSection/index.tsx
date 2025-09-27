"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  Image,
  Input,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
// TODO: Replace with Better Auth signIn

interface userDataType {
  userData: {
    usernameOrEmail: string;
    role: string;
    action: string;
  };
}

export default function OtpSection({ userData }: userDataType) {
  const [isOpen, setIsOpen] = useState(true);

  const [otp, setOtp] = useState<string[]>(Array(5).fill(""));
  const [showError, setShowError] = useState<string>("");

  const router = useRouter();
  const inputsRefs = useRef<Array<HTMLInputElement | null>>(
    Array.from({ length: 5 }, () => null)
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) {
      setShowError("Only numbers are allowed");
      return;
    }

    setShowError("");
    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = value;
      return newOtp;
    });

    if (value && index < 4) {
      inputsRefs.current[index + 1]?.focus();
    }
  };

  // changes focus when using backspace to remove otp value
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRefs.current[index - 1]?.focus();
    }
  };

  // resets otp fields if otp verification fails
  const resetOtpInputs = () => {
    setOtp(Array(5).fill(""));
    inputsRefs.current.forEach((input) => {
      if (input) {
        input.value = "";
      }
    });
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");
    
    // TODO: Replace with Better Auth implementation
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: userData.usernameOrEmail,
        role: userData.role,
        otp: otpString,
        action: userData.action,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setShowError(result.message || 'OTP verification failed');
      resetOtpInputs();
    } else {
      setShowError("");

      const sendingOtpPromise = new Promise((resolve) => {
        setTimeout(async () => {
          resolve(true);
          router.push(`/${userData.role}`);
        }, 1000);
      });

      toast.promise(
        sendingOtpPromise,
        {
          loading: "Please wait...",
          success: `${
            userData.action === "Login"
              ? "You are now logged in."
              : "Your account has been created."
          }`,
          error: "Error while verifying OTP",
        },
        { position: "bottom-center" }
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {
        setIsOpen(false);
        toast.error(`Cancelled ${userData.action} Request`);
        window.location.reload();
      }}
      placement="top-center"
    >
      <ModalContent className="p-2">
        {(onClose) => (
          <>
            <ModalBody className="flex flex-col justify-center items-center">
              <p className="text-black/80 tracking-wide font-bold">
                Enter your OTP
              </p>
              <Image
                alt="enter-otp-code"
                src="/images/verify-otp.png"
                height={200}
                width={200}
              />
              <div className="flex justify-center gap-2 w-full">
                {otp.map((value, index) => (
                  <Input
                    key={index}
                    type="text"
                    variant={showError ? "flat" : "bordered"}
                    className="max-w-10"
                    classNames={{
                      inputWrapper: "border-gray-500/40",
                    }}
                    color={showError ? "danger" : "default"}
                    maxLength={1}
                    onChange={(e) => handleInputChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputsRefs.current[index] = el)}
                    value={value}
                  />
                ))}
              </div>

              {showError && (
                <p className="text-md font-semibold text-danger">{showError}</p>
              )}

              <Button
                variant="shadow"
                className="my-2 bg-black/85 text-white"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
      <Toaster />
    </Modal>
  );
}
