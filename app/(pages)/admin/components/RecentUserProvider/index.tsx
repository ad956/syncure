// RecentUserProvider.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import getRecentUsersData from "@lib/admin/get-recent-users-data"; // Import the function
import RecentActivity from "../RecentActivity";
import SpinnerLoader from "@components/SpinnerLoader";

export default function RecentUserProvider() {
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [page, setPage] = useState(1); // Start from page 1
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastUserElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, isLoading]
  );

  useEffect(() => {
    // Initial data load
    fetchRecentUsers();
  }, [page]);

  const fetchRecentUsers = async () => {
    if (!hasMore) return;

    setIsLoading(true);

    try {
      const data = await getRecentUsersData(page);

      setRecentUsers((prev) =>
        page === 1 ? data.users : [...prev, ...data.users]
      );
      setHasMore(data.page < data.totalPages);
    } catch (error) {
      console.error("Error fetching recent users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && recentUsers.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <SpinnerLoader />
        </div>
      ) : (
        <RecentActivity
          recentUsers={recentUsers}
          lastUserElementRef={lastUserElementRef}
        />
      )}
    </>
  );
}
