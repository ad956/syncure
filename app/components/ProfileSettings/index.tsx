"use client";

import {
  Input,
  Button,
  Card,
  Avatar,
  Tooltip,
  DatePicker,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import React, { type ChangeEvent, useRef, useState, useEffect } from "react";
import { AiTwotoneEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import { DateValue, parseDate } from "@internationalized/date";
import { FaLock, FaUser } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  updateProfilePicture,
  updatePersonal,
  updateAddress,
  resetPassword,
} from "@lib/update-profile";
import FormValidator from "@utils/form-validator";

type ProfileSettingsProps = {
  user: User;
};

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const [formValidator] = useState(new FormValidator());
  const isPersonalProfile = "gender" in user && "dob" in user; // user is not a hospital

  const [firstname, setFirstName] = useState(user.firstname);
  const [lastname, setLastName] = useState(user.lastname);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [profilePicture, setProfilePicture] = useState(user.profile);
  const [dob, setDob] = useState<DateValue | undefined>(
    isPersonalProfile ? parseDate(user.dob) : undefined
  );
  const [contact, setContact] = useState(user.contact);
  const [countryCode, setCountryCode] = useState((user as any).countryCode || "+1");
  const [gender, setGender] = useState(
    isPersonalProfile ? user.gender : undefined
  );
  const [address, setAddress] = useState({
    address_line_1: user.address.address_line_1 || "",
    address_line_2: user.address.address_line_2 || "",
    city: user.address.city || "",
    state: user.address.state || "",
    zip_code: user.address.zip_code || "",
    country: user.address.country || "",
  });

  const [isVisible, setIsVisible] = useState(true);
  const [updateDisabled, setUpdateDisabled] = useState(true);

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    setUpdateDisabled(isUpdateDisabled());
  }, [
    firstname,
    lastname,
    username,
    email,
    currentPassword,
    newPassword,
    dob,
    contact,
    countryCode,
    gender,
    address,
  ]);

  function isUpdateDisabled(): boolean {
    const base =
      formValidator.hasErrors() ||
      !email ||
      !currentPassword ||
      !newPassword ||
      !address;

    if (isPersonalProfile) {
      return base || !dob || !gender;
    }
    return base;
  }

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

  function handleCurrentPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const error = FormValidator.validatePassword(e.target.value);
    formValidator.setError("currentpassword", error);
    setCurrentPassword(e.target.value);
  }

  function handleNewPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const error = FormValidator.validatePassword(e.target.value);
    formValidator.setError("newpassword", error);
    setNewPassword(e.target.value);
  }

  const isDateInvalid = (): boolean => {
    if (!dob) return false;

    const birthDate = dob;
    const today = new Date();
    let age = today.getFullYear() - birthDate.year;
    const m = today.getMonth() - birthDate.month;
    if (m < 0 || (m === 0 && today.getDate() < birthDate.day)) {
      age--;
    }
    if (age < 18 || age > 100) return true;
    return false;
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const error = FormValidator.validateContact(e.target.value);
    formValidator.setError("contact", error);
    setContact(e.target.value);
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(e.target.value);
  };

  const handleAddressChange =
    (field: keyof typeof address) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAddress({ ...address, [field]: e.target.value });
      const errors = FormValidator.validateAddress({
        ...address,
        [field]: e.target.value,
      });

      formValidator.setError(`address.${field}`, errors[field]);
    };

  const UpdateButton = ({ onUpdate }: { onUpdate: () => void }) => {
    return (
      <Button
        // isDisabled={updateDisabled} // to be done
        onClick={onUpdate}
        className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Update
      </Button>
    );
  };

  const updatePersonalInfo = async () => {
    toast.loading("Please wait");

    const updatedFields: any = {
      firstname: firstname !== user.firstname ? firstname : undefined,
      lastname: lastname !== user.lastname ? lastname : undefined,
      username: username !== user.username ? username : undefined,
      email: email !== user.email ? email : undefined,
      gender: gender !== user.gender ? gender : undefined,
      contact: contact !== user.contact ? contact : undefined,
      countryCode: countryCode !== (user as any).countryCode ? countryCode : undefined,
    };

    if (isPersonalProfile) {
      updatedFields.dob =
        dob?.toString() !== user.dob ? dob?.toString() : undefined;
      updatedFields.gender = gender !== user.gender ? gender : undefined;
    }

    const filteredFields = Object.fromEntries(
      Object.entries(updatedFields).filter(([_, v]) => v !== undefined)
    );

    if (Object.keys(filteredFields).length > 0) {
      try {
        const response = await updatePersonal(filteredFields);

        toast.dismiss();

        if (response.message) {
          toast.success("Personal information updated successfully");
        } else {
          toast.error("Failed to update personal information");
        }
      } catch (error) {
        console.error("Error updating personal information:", error);
        toast.error("An error occurred while updating personal information");
      }
    } else {
      toast.dismiss();
      toast.success("No changes to update");
    }
  };

  const updateAddressInfo = async () => {
    toast.loading("Please wait");
    const updatedFields = {
      address_line_1:
        address.address_line_1 !== user.address.address_line_1
          ? address.address_line_1
          : undefined,
      address_line_2:
        address.address_line_2 !== user.address.address_line_2
          ? address.address_line_2
          : undefined,
      city: address.city !== user.address.city ? address.city : undefined,
      state: address.state !== user.address.state ? address.state : undefined,
      zip_code:
        address.zip_code !== user.address.zip_code
          ? address.zip_code
          : undefined,
      country:
        address.country !== user.address.country ? address.country : undefined,
    };

    const filteredFields = Object.fromEntries(
      Object.entries(updatedFields).filter(([_, v]) => v !== undefined)
    );

    if (Object.keys(filteredFields).length > 0) {
      try {
        const response = await updateAddress(filteredFields);

        toast.dismiss();

        if (response.message) {
          toast.success("Address information updated successfully");
        } else {
          toast.error("Failed to update address information");
        }
      } catch (error) {
        console.error("Error updating address information:", error);
        toast.error("An error occurred while updating address information");
      }
    } else {
      toast.dismiss();
      toast.success("No changes to update");
    }
  };

  const updateSecurityInfo = async () => {
    toast.loading("Please wait");

    if (currentPassword && currentPassword !== newPassword) {
      try {
        const response = await resetPassword(currentPassword, newPassword);

        toast.dismiss();

        if (response.message) {
          toast.success("Password updated successfully");
          setCurrentPassword("");
          setNewPassword("");
        } else {
          toast.error(response.error, {
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error updating password:", error);
        toast.error("An error occurred while updating password");
      }
    } else if (currentPassword === newPassword) {
      toast.dismiss();
      toast.error("New password cannot be the same as the current password");
    } else {
      toast.dismiss();
      toast.success("No changes to update");
    }
  };

  const [activeTab, setActiveTab] = useState("personal");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card
      radius="lg"
      shadow="lg"
      className="flex flex-col md:flex-row gap-5 items-start p-2 md:p-5 h-full w-full overflow-y-auto"
    >
      {/* Sidebar */}
      <div
        className={`w-full md:w-1/4 bg-white p-4 md:p-6 ${
          isMobile ? "border-b" : "border-r"
        } border-gray-200`}
      >
        <div className="flex flex-col items-center mb-8">
          <CldUploadWidget
            signatureEndpoint="/api/cloudinary/sign-image"
            onSuccess={async (result) => {
              const info = result.info as CloudinaryUploadWidgetInfo;
              const isProfileUpdated = await updateProfilePicture(
                info.secure_url
              );
              if (isProfileUpdated.error) {
                toast.error(isProfileUpdated.error);
                return;
              }
              setProfilePicture(info.secure_url);
              toast.success("Profile picture updated successfully");
            }}
          >
            {({ open }) => (
              <Tooltip content="Click to Update Your Profile Picture">
                <Avatar
                  src={profilePicture}
                  className="w-24 h-24 md:w-32 md:h-32 text-large cursor-pointer mb-4"
                  onClick={() => open()}
                />
              </Tooltip>
            )}
          </CldUploadWidget>
          <h2 className="text-xl font-semibold">{`${user.firstname} ${user.lastname}`}</h2>
          <p className="text-gray-500">@{user.username}</p>
        </div>
        <nav className="flex flex-row md:flex-col justify-around md:justify-start">
          {["personal", "address", "security"].map((tab) => (
            <Button
              size="md"
              key={tab}
              className={`flex justify-start items-center bg-transparent w-auto md:w-4/5 p-2 md:p-3 mb-2 transition-colors duration-200 ${
                activeTab === tab
                  ? "bg-blue100 bg-[#1f1c2e] text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              <div className="flex items-center justify-center md:justify-start w-full">
                {tab === "personal" && <FaUser className="md:mr-2" />}
                {tab === "address" && <FaMapMarkerAlt className="md:mr-2" />}
                {tab === "security" && <FaLock className="md:mr-2" />}
                <span className="hidden md:inline ml-2">
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
                </span>
              </div>
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        <div className="relative">
          {/* Personal Information */}
          <div
            className={`absolute w-full transition-all duration-300 ease-in-out ${
              activeTab === "personal" ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Card className="p-4 md:p-6">
              <h3 className="text-xl font-semibold mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="firstname"
                  type="text"
                  variant="underlined"
                  label="First Name"
                  value={firstname}
                  className="max-w-xs"
                  onChange={handleFirstNameChange}
                  isInvalid={!!formValidator.getError("firstname")}
                  errorMessage={formValidator.getError("firstname")}
                />
                <Input
                  name="lastname"
                  type="text"
                  variant="underlined"
                  label="Last Name"
                  value={lastname}
                  className="max-w-xs"
                  onChange={handleLastNameChange}
                  isInvalid={!!formValidator.getError("lastname")}
                  errorMessage={formValidator.getError("lastname")}
                />
                <Input
                  name="username"
                  type="text"
                  variant="underlined"
                  label="Username"
                  autoComplete="username"
                  value={username}
                  className="max-w-xs"
                  onChange={handleUserNameChange}
                  isInvalid={!!formValidator.getError("username")}
                  errorMessage={formValidator.getError("username")}
                />
                <Input
                  name="email"
                  type="email"
                  variant="underlined"
                  label="Email address"
                  value={email}
                  className="max-w-xs"
                  autoComplete="email"
                  onChange={handleEmailChange}
                  isInvalid={!!formValidator.getError("email")}
                  errorMessage={formValidator.getError("email")}
                />

                {isPersonalProfile && (
                  <>
                    <Select
                      name="gender"
                      variant="underlined"
                      label="Gender"
                      value={gender}
                      defaultSelectedKeys={gender ? [gender] : []}
                      className="max-w-xs"
                      onChange={handleGenderChange}
                    >
                      {["Male", "Female", "Other"].map((item) => (
                        <SelectItem key={item}>{item}</SelectItem>
                      ))}
                    </Select>
                    <DatePicker
                      name="dob"
                      label="DOB"
                      variant="underlined"
                      className="max-w-xs"
                      value={dob}
                      onChange={(val) => setDob(val)}
                      showMonthAndYearPickers
                      isInvalid={isDateInvalid()}
                      errorMessage={(value) => {
                        if (value.isInvalid) {
                          return "Please enter a valid date.";
                        }
                      }}
                    />
                  </>
                )}

                <Select
                  name="countryCode"
                  variant="underlined"
                  label="Country Code"
                  value={countryCode}
                  defaultSelectedKeys={[countryCode]}
                  className="max-w-xs"
                  onChange={handleCountryCodeChange}
                >
                  <SelectItem key="+1">+1 (US/CA)</SelectItem>
                  <SelectItem key="+44">+44 (UK)</SelectItem>
                  <SelectItem key="+91">+91 (IN)</SelectItem>
                  <SelectItem key="+86">+86 (CN)</SelectItem>
                  <SelectItem key="+49">+49 (DE)</SelectItem>
                  <SelectItem key="+33">+33 (FR)</SelectItem>
                  <SelectItem key="+81">+81 (JP)</SelectItem>
                  <SelectItem key="+61">+61 (AU)</SelectItem>
                </Select>
                <Input
                  name="contact"
                  type="text"
                  variant="underlined"
                  label="Phone Number"
                  value={contact}
                  className="max-w-xs"
                  onChange={handleContactChange}
                  isInvalid={!!formValidator.getError("contact")}
                  errorMessage={formValidator.getError("contact")}
                />
              </div>
            </Card>
            <UpdateButton onUpdate={updatePersonalInfo} />
          </div>

          {/* Address Information */}
          <div
            className={`absolute w-full transition-all duration-300 ease-in-out ${
              activeTab === "address" ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Card className="p-4 md:p-6">
              <h3 className="text-xl font-semibold mb-4">
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea
                  name="address_line_1"
                  variant="underlined"
                  label="Address Line 1"
                  value={address.address_line_1}
                  className="max-w-xs"
                  onChange={handleAddressChange("address_line_1")}
                  isInvalid={!!formValidator.getError("address.address_line_1")}
                  errorMessage={formValidator.getError(
                    "address.address_line_1"
                  )}
                />
                <Textarea
                  name="address_line_2"
                  variant="underlined"
                  label="Address Line 2"
                  value={address.address_line_2}
                  className="max-w-xs"
                  onChange={handleAddressChange("address_line_2")}
                  isInvalid={!!formValidator.getError("address.address_line_2")}
                  errorMessage={formValidator.getError(
                    "address.address_line_2"
                  )}
                />
                <Input
                  name="city"
                  type="text"
                  variant="underlined"
                  label="City"
                  value={address.city}
                  className="max-w-xs"
                  onChange={handleAddressChange("city")}
                  isInvalid={!!formValidator.getError("city")}
                  errorMessage={formValidator.getError("city")}
                />
                <Input
                  name="state"
                  type="text"
                  variant="underlined"
                  label="State"
                  value={address.state}
                  className="max-w-xs"
                  onChange={handleAddressChange("state")}
                  isInvalid={!!formValidator.getError("address.state")}
                  errorMessage={formValidator.getError("address.state")}
                />
                <Input
                  name="zip_code"
                  type="text"
                  variant="underlined"
                  label="Zip Code"
                  value={address.zip_code}
                  className="max-w-xs"
                  onChange={handleAddressChange("zip_code")}
                  isInvalid={!!formValidator.getError("address.zipcode")}
                  errorMessage={formValidator.getError("address.zipcode")}
                />
                <Input
                  name="country"
                  type="text"
                  variant="underlined"
                  label="Country"
                  value={address.country}
                  className="max-w-xs"
                  onChange={handleAddressChange("country")}
                  isInvalid={!!formValidator.getError("address.country")}
                  errorMessage={formValidator.getError("address.country")}
                />
              </div>
            </Card>
            <UpdateButton onUpdate={updateAddressInfo} />
          </div>

          {/* Security Settings */}
          <div
            className={`absolute w-full transition-all duration-300 ease-in-out ${
              activeTab === "security" ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Security Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="currentpassword"
                  type={isVisible ? "text" : "password"}
                  variant="underlined"
                  label="Current Password"
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                  className="max-w-xs"
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
                  isInvalid={!!formValidator.getError("currentpassword")}
                  errorMessage={formValidator.getError("currentpassword")}
                />
                <Input
                  name="newpassword"
                  type={isVisible ? "text" : "password"}
                  variant="underlined"
                  label="New Password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  className="max-w-xs"
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
                  isInvalid={!!formValidator.getError("newpassword")}
                  errorMessage={formValidator.getError("newpassword")}
                />
              </div>
            </Card>
            <UpdateButton onUpdate={updateSecurityInfo} />
          </div>
        </div>
      </div>
      <Toaster />
    </Card>
  );
}
