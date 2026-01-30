"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import TopBar from "@/components/TopBar";
import NavigationBar from "@/components/NavigationBar";
import styles from "./dashboard.module.scss";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useUser();
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.topbar}>
        <TopBar logout={handleLogout} user={user} setShow={setShowNav} />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.sidebar}>
          <NavigationBar show={showNav} setShow={setShowNav} />
        </div>
        <div className={styles.inner}>{children}</div>
      </div>
    </div>
  );
}
