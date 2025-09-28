"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Input, Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import AnimatedBackground from "@components/AnimatedBackground";
import FormValidator from "@utils/form-validator";
import { AiOutlineEyeInvisible, AiTwotoneEye } from "react-icons/ai";
import addAdmin from "@lib/admin/add-admin";

export const dynamic = 'force-dynamic';

export default function AddAdmin() {
  const [formValidator] = useState(new FormValidator());

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    let error: any = "";

    switch (name) {
      case "firstname":
      case "lastname":
        error = FormValidator.validateName(value, name);
        break;
      case "email":
        error = FormValidator.validateEmail(value);
        break;
      case "password":
        error = FormValidator.validatePassword(value);
        break;
    }

    formValidator.setError(name, error);
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    const hasErrors = formValidator.hasErrors();
    const allFieldsFilled = Object.values(formData).every(
      (field) => field !== ""
    );
    setIsSubmitDisabled(hasErrors || !allFieldsFilled);
  }, [formData]);

  async function handleFormSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    const formDataToSend = new FormData(e.currentTarget);

    const toastId = toast.loading("Adding new admin...", {
      position: "top-center",
    });

    try {
      const result = await addAdmin(formDataToSend);

      if (result.error) {
        toast.error(result.error.message, {
          id: toastId,
          position: "top-center",
        });
      } else {
        toast.success("Admin added successfully!", { id: toastId });
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.", {
        id: toastId,
      });
    }
  }

  return (
    <AnimatedBackground>
      <Card className="w-full max-w-4xl shadow-lg mt-8 h-4/5">
        <CardHeader className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Create New Admin
          </h1>
        </CardHeader>
        <CardBody className="p-8 flex flex-col md:flex-row gap-8 scrollbar">
          {/* Left side - Add Admin Form */}
          <div className="flex-1">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Input
                  name="firstname"
                  type="text"
                  placeholder="John"
                  variant="bordered"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  startContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  }
                  isInvalid={!!formValidator.getError("firstname")}
                  errorMessage={formValidator.getError("firstname")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Input
                  name="lastname"
                  type="text"
                  placeholder="Doe"
                  variant="bordered"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  startContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  }
                  isInvalid={!!formValidator.getError("lastname")}
                  errorMessage={formValidator.getError("lastname")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="johndoe@example.com"
                  variant="bordered"
                  value={formData.email}
                  onChange={handleInputChange}
                  startContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  }
                  isInvalid={!!formValidator.getError("email")}
                  errorMessage={formValidator.getError("email")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  name="password"
                  type={isVisible ? "text" : "password"}
                  placeholder="••••••••"
                  variant="bordered"
                  startContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  }
                  value={formData.password}
                  onChange={handleInputChange}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <AiOutlineEyeInvisible className="text-2xl text-default-400" />
                      ) : (
                        <AiTwotoneEye className="text-2xl text-default-400" />
                      )}
                    </button>
                  }
                  autoComplete="current-password"
                  isInvalid={!!formValidator.getError("password")}
                  errorMessage={formValidator.getError("password")}
                />
              </div>

              <Button
                type="submit"
                isDisabled={isSubmitDisabled}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Create Admin Account
              </Button>
            </form>
          </div>

          {/* Right side - Decorative content */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <motion.div
              className="w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                times: [0, 0.5, 1],
                repeat: Infinity,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-24 h-24 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </motion.div>
            <h2 className="mt-6 text-xl font-semibold text-gray-800">
              Welcome to the Admin Team
            </h2>
            <p className="mt-2 text-gray-600 text-center">
              Join us in managing and improving our platform.
            </p>
          </div>
        </CardBody>
      </Card>
      <Toaster />
    </AnimatedBackground>
  );
}
