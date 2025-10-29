// RecentUserProvider.tsx
"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRecentUsers } from "@hooks/useAdmin";
import RecentActivity from "../RecentActivity";
import SpinnerLoader from "@components/SpinnerLoader";

export default function RecentUserProvider() {
  const [page, setPage] = useState(1);
  const { users: recentUsers, isLoading } = useRecentUsers(page, 10);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastUserElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading]
  );



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
