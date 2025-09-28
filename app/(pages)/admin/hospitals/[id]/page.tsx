"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Dropdown,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  User,
  Card,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {
  AiOutlineSearch as SearchIcon,
  AiOutlinePlus as PlusIcon,
  AiOutlineStop as BlockIcon,
} from "react-icons/ai";
import SpinnerLoader from "@components/SpinnerLoader";
import { getHospitalDetails } from "@lib/admin/get-hospitals";
import { FaExclamationCircle } from "react-icons/fa";

export const dynamic = 'force-dynamic';

function UserManagement({ params }: { params: { id: string } }) {
  const [users, setUsers] = useState<HospitalUserData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("All");

  const [currentUser, setCurrentUser] = useState<HospitalUserData | null>(null);
  const [pagination, setPagination] = useState<PaginationMetadata>({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, pagination.pageSize]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getHospitalDetails(
        params.id,
        pagination.currentPage,
        pagination.pageSize
      );

      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedRole === "All" || user.role === selectedRole)
  );

  const handleBlockUser = async (userId: string) => {
    console.log("Block user:", userId);
    await fetchUsers();
  };

  return (
    <div className="p-4 max-h-screen overflow-hidden">
      <Card className="p-6 w-full mx- h-full flex flex-col">
        <div className="p-2 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Users Management
          </h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              startContent={<SearchIcon className="w-5 h-5 text-gray-400" />}
              className="w-full md:w-64"
            />
            <Dropdown>
              <Button variant="flat">{selectedRole}</Button>
              <DropdownMenu
                aria-label="Role selection"
                onAction={(key) => setSelectedRole(key as string)}
                selectedKeys={[selectedRole]}
                selectionMode="single"
              >
                <DropdownItem key="All">All</DropdownItem>
                <DropdownItem key="Patient">Patient</DropdownItem>
                <DropdownItem key="Doctor">Doctor</DropdownItem>
                <DropdownItem key="Receptionist">Receptionist</DropdownItem>
                <DropdownItem key="Hospital">Hospital</DropdownItem>
                <DropdownItem key="Admin">Admin</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <Button
            color="danger"
            startContent={<PlusIcon className="w-5 h-5" />}
            onClick={() => {
              setCurrentUser(null);
            }}
          >
            Blocked Users
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <SpinnerLoader />
          </div>
        ) : (
          <div className="flex-grow overflow-y-scroll scrollbar">
            <Table aria-label="User management table">
              <TableHeader>
                <TableColumn>User</TableColumn>
                <TableColumn>Role</TableColumn>
                <TableColumn>Username</TableColumn>
                <TableColumn>Gender</TableColumn>
                <TableColumn>Contact</TableColumn>
                <TableColumn>Location</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody
                emptyContent={
                  <div className="flex flex-col items-center justify-center space-y-2 text-gray-600">
                    <FaExclamationCircle className="w-12 h-12 text-gray-400" />
                    <h2 className="text-xl font-semibold">No users found</h2>
                  </div>
                }
              >
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <User
                        name={user.name}
                        avatarProps={{
                          src:
                            user.profile ||
                            `https://i.pravatar.cc/150?u=${user.id}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.contact}</TableCell>
                    <TableCell>{`${user.city}, ${user.state}`}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="light"
                        startContent={<BlockIcon className="w-4 h-4" />}
                        onClick={() => handleBlockUser(user.id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 rounded-full px-4 py-1 transition-colors duration-200"
                      >
                        Block
                      </Button>
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
}

export default UserManagement;
