"use client";


import { Button, Image } from "@nextui-org/react";
import React, { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log(error, errorInfo);
    this.setState({ errorMessage: error.message });
  }

  handleRetry = () => {
    console.log("Retrying...");
    window.location.reload();
  };

  handleLogout = async () => {
    console.log("Logging out...");
    const { signOut } = await import('@lib/auth/client');
    await signOut();
    window.location.href = '/login';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col justify-center items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <Image
              alt="error-image"
              src="/images/error.jpg"
              width={400}
              height={300}
            />
            <h2 className="text-[#606060] font-bold tracking-wider text-4xl">
              Oops! Something went wrong.
            </h2>
            <p className="text-black/55 font-medium text-xl">
              We&#39;re sorry, but there was an error{" "}
              <span className="">{this.state.errorMessage}.</span> Please try
              again.
            </p>
            <div className="flex flex-row gap-2 items-center">
              <Button
                onClick={this.handleRetry}
                className="bg-[#06d096] text-[#ffffff] text-md font-semibold my-5 max-w-32"
              >
                Retry
              </Button>
              <Button
                onClick={this.handleLogout}
                className="bg-[#ff4d4f] text-[#ffffff] text-md font-semibold my-5 max-w-32"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
