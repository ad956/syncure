"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  getRecentUsersData,
  getTilesData,
} from "@lib/admin/get-dashboard-data";
import SpinnerLoader from "@components/SpinnerLoader";
import AppointmentBar from "./components/AppointmentBar";
import HospitalApprovalList from "./components/HospitalApprovalList";
import MonthlyRevenueChart from "./components/MonthlyRevenueChart";
import RecentActivity from "./components/RecentActivity";
import StatisticsCards from "./components/StatisticsCards";
import UserDistributionPie from "./components/UserPie";

export default function Admin() {
  const [tilesData, setTilesData] = useState<TilesDataType | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingTiles, setIsLoadingTiles] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastUserElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tiles = await getTilesData();
        setTilesData(tiles);
      } finally {
        setIsLoadingTiles(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchRecentUsers();
  }, [page]);

  const fetchRecentUsers = async () => {
    if (!hasMore) return;

    setIsLoadingUsers(true);

    try {
      const data: PaginatedResponse = await getRecentUsersData(page);

      setRecentUsers((prev) => [...prev, ...data.users]);
      setHasMore(data.page < data.totalPages);
    } catch (error) {
      console.error("Error fetching recent users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const isLoading = isLoadingTiles || isLoadingUsers;

  const appointmentData = [
    {
      id: "appointments",
      color: "hsl(207, 70%, 50%)",
      data: [
        { x: "Jan", y: 65 },
        { x: "Feb", y: 59 },
        { x: "Mar", y: 80 },
        { x: "Apr", y: 81 },
        { x: "May", y: 56 },
        { x: "Jun", y: 55 },
      ],
    },
  ];

  const userDistributionData = [
    { id: "patients", label: "Patients", value: 10 },
    { id: "receptionists", label: "Receptionists", value: 20 },
    { id: "doctors", label: "Doctors", value: 30 },
    { id: "hospitals", label: "Hospitals", value: 96 },
    { id: "admins", label: "Admins", value: 20 },
  ];

  const mockNewHospitals = [
    { id: "1", name: "Central Hospital", email: "central@example.com" },
    { id: "2", name: "Westside Clinic", email: "westside@example.com" },
    { id: "3", name: "Sunshine Medical Center", email: "sunshine@example.com" },
    {
      id: "4",
      name: "Northern Health Institute",
      email: "northern@example.com",
    },
    { id: "5", name: "Riverside Hospital", email: "riverside@example.com" },
  ];

  const mockMonthlyRevenue = [
    {
      id: "Monthly Revenue",
      data: [
        { x: "Jan", y: 50000 },
        { x: "Feb", y: 55000 },
        { x: "Mar", y: 60000 },
        { x: "Apr", y: 58000 },
        { x: "May", y: 65000 },
        { x: "Jun", y: 70000 },
        { x: "Jul", y: 68000 },
        { x: "Aug", y: 72000 },
        { x: "Sep", y: 75000 },
        { x: "Oct", y: 80000 },
        { x: "Nov", y: 85000 },
        { x: "Dec", y: 90000 },
      ],
    },
  ];

  return (
    <div className="flex flex-col overflow-y-scroll scrollbar">
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <SpinnerLoader />
            </div>
          ) : (
            <>
              {/* Statistics Cards*/}
              <StatisticsCards tilesData={tilesData} />

              {/* Graphs */}
              <div className="grid grid-cols-2 gap-6">
                <AppointmentBar data={appointmentData} />
                <UserDistributionPie data={userDistributionData} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Monthly Revenue Chart */}
                <MonthlyRevenueChart data={mockMonthlyRevenue} />

                {/* Hospital Approval List */}
                <HospitalApprovalList hospitals={mockNewHospitals} />
              </div>

              {/* Recent Activity */}
              <RecentActivity
                recentUsers={recentUsers}
                lastUserElementRef={lastUserElementRef}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
