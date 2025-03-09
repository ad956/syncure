"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Textarea,
  Avatar,
  Divider,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import useQuery from "@hooks/useQuery";
import SpinnerLoader from "@components/SpinnerLoader";
import {
  LuBuilding2,
  LuClock,
  LuPhone,
  LuUsers,
  LuStethoscope,
  LuLaptop,
} from "react-icons/lu";

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function EditHospitalDetails() {
  const {
    data: hospitalInfo,
    isLoading,
    error,
  } = useQuery<HospitalDetailsType>("/api/hospital/additional-details");

  const [formData, setFormData] = useState(hospitalInfo);

  useEffect(() => {
    if (hospitalInfo) {
      setFormData(hospitalInfo);
    }
  }, [hospitalInfo]);

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-danger">
            Error loading hospital information
          </h2>
          <p className="text-default-500">Please try again later</p>
        </Card>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">
            Hospital information is unavailable
          </h2>
          <p className="text-default-500">Please try again later</p>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev!,
      additionalInfo: {
        ...prev!.additionalInfo,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="overflow-y-scroll scrollbar bg-gradient-to-b from-background to-default-100 p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="max-w-7xl mx-auto space-y-6"
      >
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Hospital Management Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={cardVariants}>
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar
                    src="https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&q=80"
                    className="w-16 h-16"
                  />
                  <div>
                    <h2 className="text-2xl font-semibold">
                      Edit Hospital Details
                    </h2>
                    <p className="text-default-500">
                      Update your hospital information
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Total Staff"
                    value={formData.additionalInfo.totalStaffCount.toString()}
                    onChange={(e) =>
                      handleInputChange("totalStaffCount", e.target.value)
                    }
                    startContent={
                      <LuUsers className="text-default-400" size={20} />
                    }
                    variant="bordered"
                  />

                  <Input
                    label="Average Staff Experience (Years)"
                    value={formData.additionalInfo.averageStaffExperience.toString()}
                    onChange={(e) =>
                      handleInputChange(
                        "averageStaffExperience",
                        e.target.value
                      )
                    }
                    startContent={
                      <LuClock className="text-default-400" size={20} />
                    }
                    variant="bordered"
                  />

                  <Textarea
                    label="Services Offered"
                    value={formData.additionalInfo.servicesOffered.join(", ")}
                    onChange={(e) =>
                      handleInputChange("servicesOffered", e.target.value)
                    }
                    variant="bordered"
                    minRows={3}
                    startContent={
                      <LuStethoscope
                        className="text-default-400 mt-2"
                        size={20}
                      />
                    }
                  />

                  <Textarea
                    label="Equipment Available"
                    value={formData.additionalInfo.equipmentAvailable.join(
                      ", "
                    )}
                    onChange={(e) =>
                      handleInputChange("equipmentAvailable", e.target.value)
                    }
                    variant="bordered"
                    minRows={3}
                    startContent={
                      <LuLaptop className="text-default-400 mt-2" size={20} />
                    }
                  />

                  <Input
                    label="Operational Hours"
                    value={formData.additionalInfo.operationalHours}
                    onChange={(e) =>
                      handleInputChange("operationalHours", e.target.value)
                    }
                    startContent={
                      <LuClock className="text-default-400" size={20} />
                    }
                    variant="bordered"
                  />

                  <Input
                    label="Emergency Contact"
                    value={formData.additionalInfo.emergencyContact}
                    onChange={(e) =>
                      handleInputChange("emergencyContact", e.target.value)
                    }
                    startContent={
                      <LuPhone className="text-default-400" size={20} />
                    }
                    variant="bordered"
                  />
                </div>

                <Button color="secondary" type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <LuBuilding2 className="h-8 w-8 text-secondary" />
                <div>
                  <h2 className="text-2xl font-semibold">Hospital Overview</h2>
                  <p className="text-default-500">
                    Current hospital information
                  </p>
                </div>
              </div>

              <Divider className="my-4" />

              <div className="space-y-6">
                <Card className="bg-default-50">
                  <div className="flex items-center gap-4 p-4">
                    <LuUsers className="h-8 w-8 text-secondary" />
                    <div>
                      <p className="text-sm text-default-500">Total Staff</p>
                      <p className="text-lg font-semibold">
                        {formData.additionalInfo.totalStaffCount}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-default-50">
                  <div className="flex items-center gap-4 p-4">
                    <LuClock className="h-8 w-8 text-secondary" />
                    <div>
                      <p className="text-sm text-default-500">
                        Average Experience
                      </p>
                      <p className="text-lg font-semibold">
                        {formData.additionalInfo.averageStaffExperience} years
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-default-50">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <LuStethoscope className="h-5 w-5 text-secondary" />
                      <h3 className="font-semibold">Services Offered</h3>
                    </div>
                    <p className="text-default-500">
                      {formData.additionalInfo.servicesOffered.join(", ")}
                    </p>
                  </div>
                </Card>

                <Card className="bg-default-50">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <LuLaptop className="h-5 w-5 text-secondary" />
                      <h3 className="font-semibold">Equipment Available</h3>
                    </div>
                    <p className="text-default-500">
                      {formData.additionalInfo.equipmentAvailable.join(", ")}
                    </p>
                  </div>
                </Card>

                <Card className="bg-default-50">
                  <div className="flex items-center gap-4 p-4">
                    <LuClock className="h-8 w-8 text-secondary" />
                    <div>
                      <p className="text-sm text-default-500">
                        Operational Hours
                      </p>
                      <p className="text-lg font-semibold">
                        {formData.additionalInfo.operationalHours}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-default-50">
                  <div className="flex items-center gap-4 p-4">
                    <LuPhone className="h-8 w-8 text-secondary" />
                    <div>
                      <p className="text-sm text-default-500">
                        Emergency Contact
                      </p>
                      <p className="text-lg font-semibold">
                        {formData.additionalInfo.emergencyContact}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
