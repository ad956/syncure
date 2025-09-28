"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  User,
  Card,
} from "@nextui-org/react";
import {
  AiOutlineFileDone,
  AiOutlineSearch,
  AiOutlineStop,
  AiOutlineTeam,
} from "react-icons/ai";
import SpinnerLoader from "@components/SpinnerLoader";
import Link from "next/link";
import { getHospitalsList } from "@lib/admin/get-hospitals";
import { FaExclamationCircle } from "react-icons/fa";

export const dynamic = 'force-dynamic';

const HospitalManagement: React.FC = () => {
  const [hospitals, setHospitals] = useState<HospitalDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [pagination, setPagination] = useState<PaginationMetadata>({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
  });

  useEffect(() => {
    fetchHospitals();
  }, [pagination.currentPage, pagination.pageSize]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const data = await getHospitalsList(
        pagination.currentPage,
        pagination.pageSize
      );
      setHospitals(data.hospitals);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlockHospital = async (hospitalId: string) => {
    console.log("Block hospital:", hospitalId);
    // Implement block logic here
    await fetchHospitals();
  };

  return (
    <div className="p-4 max-h-screen overflow-hidden">
      <Card className="p-6 w-full h-full flex flex-col">
        <div className="p-2 rounded-lg shadow-sm flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Hospital Management
          </h1>

          <Input
            placeholder="Search hospitals..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            startContent={<AiOutlineSearch className="w-5 h-5 text-gray-400" />}
            className="rounded-full pl-10 pr-4 py-2 max-w-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <SpinnerLoader />
          </div>
        ) : (
          <div className="flex-grow overflow-y-scroll scrollbar">
            <Table aria-label="Hospitals management table">
              <TableHeader>
                <TableColumn>Hospital</TableColumn>
                <TableColumn>Username</TableColumn>
                <TableColumn>Contact</TableColumn>
                <TableColumn>Location</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>

              <TableBody
                emptyContent={
                  <div className="flex flex-col items-center justify-center space-y-2 text-gray-600">
                    <FaExclamationCircle className="w-12 h-12 text-gray-400" />
                    <h2 className="text-xl font-semibold">
                      No hospitals found
                    </h2>
                  </div>
                }
              >
                {filteredHospitals.map((hospital) => (
                  <TableRow key={hospital.id}>
                    <TableCell>
                      <User
                        name={hospital.name}
                        avatarProps={{
                          src:
                            hospital.profile ||
                            `https://i.pravatar.cc/150?u=${hospital.id}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>{hospital.username}</TableCell>
                    <TableCell>{hospital.contact}</TableCell>
                    <TableCell>{`${hospital.city}, ${hospital.state}`}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          as={Link}
                          href={`/admin/hospitals/${hospital.id}`}
                          size="sm"
                          variant="light"
                          startContent={<AiOutlineTeam className="w-4 h-4" />}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full px-4 py-1 transition-colors duration-200"
                        >
                          Manage Users
                        </Button>
                        <Button
                          as={Link}
                          href={`/admin/hospitals/report/${hospital.id}`}
                          size="sm"
                          variant="light"
                          startContent={
                            <AiOutlineFileDone className="w-4 h-4" />
                          }
                          className="bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-full px-4 py-1 transition-colors duration-200"
                        >
                          Reports
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          startContent={<AiOutlineStop className="w-4 h-4" />}
                          onClick={() => handleBlockHospital(hospital.id)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 rounded-full px-4 py-1 transition-colors duration-200"
                        >
                          Block
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Pagination
            total={pagination.totalPages}
            initialPage={pagination.currentPage}
            onChange={(page) =>
              setPagination({ ...pagination, currentPage: page })
            }
            showControls
            page={pagination.currentPage}
            classNames={{
              cursor: "bg-foreground text-background",
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default HospitalManagement;
