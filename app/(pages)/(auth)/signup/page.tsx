"use client";

import { useState, type ChangeEvent, useEffect } from "react";
import { AiTwotoneEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { carouselData, roles } from "@constants/index";
import BrandLogo from "@components/BrandLogo";
import Carousel from "@components/Carousel";
import OtpSection from "@components/OtpSection";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Selection,
  Link,
} from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import { MdAlternateEmail, MdOutlineKey } from "react-icons/md";
import { PiUserCircleDuotone } from "react-icons/pi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { signupAction } from "@lib/actions";
import FormValidator from "@utils/form-validator";

export default function Signup() {
  const [formValidator] = useState(new FormValidator());

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Selection>(new Set([]));
  const [roleTouched, setRoleTouched] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [userData, setUserData] = useState({
    usernameOrEmail: "",
    role: "",
    action: "",
  });

  const isRoleValid = Array.from(role).length > 0;

  const toggleVisibility = () => setIsVisible(!isVisible);

  function handleFirstNameChange(e: ChangeEvent<HTMLInputElement>) {
    const error = FormValidator.validateName(e.target.value, "firstname");
    formValidator.setError("firstName", error);
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e: ChangeEvent<HTMLInputElement>) {
    const error = FormValidator.validateName(e.target.value, "lastname");
    formValidator.setError("lastName", error);
    setLastName(e.target.value);
  }

  function handleUserNameChange(e: ChangeEvent<HTMLInputElement>) {
    const error = FormValidator.validateUsername(e.target.value);
    formValidator.setError("username", error);
    setUsername(e.target.value);
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    const error = FormValidator.validateEmail(e.target.value);
    formValidator.setError("email", error);
    setEmail(e.target.value);
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const error = FormValidator.validatePassword(e.target.value);
    formValidator.setError("password", error);
    setPassword(e.target.value);
  }

  function handleConfirmPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const error = FormValidator.validateConfirmPassword(
      password,
      e.target.value
    );
    formValidator.setError("confirmpassword", error);
    setConfirmPassword(e.target.value);
  }

  async function handleFormSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    try {
      toast.loading("Please wait ...", {
        position: "bottom-center",
      });

      const response = await signupAction(formData);
      toast.dismiss();

      if (response.error) {
        toast.error(`${response.error.message}`);
      } else {
        const userRole = formData.get("role");

        setUserData({
          usernameOrEmail: email,
          role: userRole?.toString() || "",
          action: "Signup",
        });

        toast.success(
          "Almost done! Please use the OTP you received to complete signup. Thank you!",
          {
            duration: 2000,
            position: "bottom-center",
          }
        );
        setShowOtp(true);
      }
    } catch (error) {
      toast.dismiss();
      console.error("Signup failed:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }

  useEffect(() => {
    setSubmitDisabled(
      formValidator.hasErrors() ||
        !firstName ||
        !lastName ||
        !username ||
        !email ||
        !password ||
        !confirmPassword ||
        !isRoleValid
    );
  }, [formValidator, isRoleValid, firstName, lastName, username, email, password, confirmPassword, role]);

  return (
    <div
      className={
        "bg-[#eef1f8]/20 h-screen flex flex-col justify-center lg:flex-row  lg:justify-around"
      }
    >
      {/* // right part only visible from lg */}
      <div className="hidden lg:w-2/5 m-2 bg-[#161313] rounded-t-2xl rounded-br-2xl  rounded-bl-[40px]  lg:flex lg:flex-col lg:justify-center lg:items-center">
        <Carousel data={carouselData} />
      </div>

      {/* left part */}
      <div className="m-4 lg:w-2/6 flex flex-col gap-8 self-center">
        <div className="flex justify-center items-center ">
          <BrandLogo />
        </div>
        <div className="">
          <h3 className="text-3xl font-bold tracking-wider">Welcome</h3>
          <p className="text-[13px] text-gray-500">
            Please enter your details below
          </p>
        </div>

        <form
          className="flex flex-col justify-center tems-center"
          onSubmit={handleFormSubmit}
        >
          <div className="flex flex-row">
            <Input
              type="text"
              variant="bordered"
              name="firstname"
              placeholder="First name"
              startContent={<IoPersonCircleOutline size={25} />}
              size="lg"
              value={firstName}
              className="mx-2 my-1"
              onChange={handleFirstNameChange}
              isInvalid={!!formValidator.getError("firstname")}
              errorMessage={formValidator.getError("firstname")}
            />
            <Input
              type="text"
              variant="bordered"
              name="lastname"
              placeholder="Last name"
              startContent={<IoPersonCircleOutline size={25} />}
              size="lg"
              value={lastName}
              className="mx-2 my-1"
              onChange={handleLastNameChange}
              isInvalid={!!formValidator.getError("lastname")}
              errorMessage={formValidator.getError("lastname")}
            />
          </div>
          <Input
            type="text"
            variant="bordered"
            name="username"
            placeholder="Username"
            startContent={<PiUserCircleDuotone size={25} />}
            size="lg"
            value={username}
            autoComplete="username"
            className="mx-2 my-1"
            onChange={handleUserNameChange}
            isInvalid={!!formValidator.getError("username")}
            errorMessage={formValidator.getError("username")}
          />
          <Input
            type="email"
            variant="bordered"
            placeholder="you@example.com"
            name="email"
            startContent={<MdAlternateEmail size={20} />}
            size="lg"
            value={email}
            autoComplete="email"
            className="mx-2 my-1"
            onChange={handleEmailChange}
            isInvalid={!!formValidator.getError("email")}
            errorMessage={formValidator.getError("email")}
          />
          <Input
            name="password"
            variant="bordered"
            size="lg"
            placeholder="Password"
            autoComplete="new-password"
            startContent={<MdOutlineKey />}
            value={password}
            onChange={handlePasswordChange}
            className="mx-2 my-1"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <AiOutlineEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <AiTwotoneEye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            isInvalid={!!formValidator.getError("password")}
            errorMessage={formValidator.getError("password")}
          />
          <Input
            name="confirmpassword"
            variant="bordered"
            size="lg"
            placeholder="Confirm Password"
            autoComplete="new-password"
            startContent={<MdOutlineKey />}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="mx-2 my-1"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <AiOutlineEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <AiTwotoneEye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            isInvalid={!!formValidator.getError("confirmpassword")}
            errorMessage={formValidator.getError("confirmpassword")}
          />

          <Select
            name="role"
            isRequired
            items={roles}
            variant="bordered"
            size="md"
            label="Role"
            placeholder="Select who you are"
            className="mx-2 my-2"
            selectedKeys={role}
            onSelectionChange={setRole}
            onClose={() => setRoleTouched(true)}
            errorMessage={
              isRoleValid || !roleTouched ? "" : "You must select a role"
            }
            isInvalid={isRoleValid || !roleTouched ? false : true}
          >
            {(roles) => (
              <SelectItem key={roles.value}>{roles.label}</SelectItem>
            )}
          </Select>
          <div className="flex justify-center gap-5 items-center">
            <Button
              type="submit"
              variant="shadow"
              className="text-white text-lg rounded-lg bg-[#0d0909] h-12 w-3/5 ml-4 my-2"
              isDisabled={submitDisabled}
            >
              Sign up
            </Button>
            <Button
              as={Link}
              className="h-12 w-2/5 sm:w-1/3 bg-white text-black font-semibold py-3 rounded-lg border-2 border-black transition duration-300 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              href="/login"
            >
              Try Demo
            </Button>
          </div>
        </form>

        {/* passing the user data to otp section */}
        {showOtp && <OtpSection userData={userData} />}
        <p className="text-gray-500 text-sm text-center">
          Have an account?{" "}
          <Link href="/login" className="text-black">
            Sign In
          </Link>
        </p>
      </div>
      <Toaster />
    </div>
  );
}
