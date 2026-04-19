"use client";

import { useWindowSize } from "@/context/window-size-context";
import type { SessionUser } from "@/types";
import styles from "./TopBar.module.scss";

interface Props {
  logout?: () => void;
  setShow?: (show: boolean) => void;
  user: SessionUser | null;
}

export default function TopBar({ logout, setShow, user }: Props) {
  const windowSize = useWindowSize();

  const handleHomeClick = () => {
    window.location.href = window.location.origin + "/dashboard";
  };

  return (
    <div className={styles.wrapper}>
      {windowSize.width < 1024 ? (
        <>
          <div className={styles.menu}>
            <span
              className="glyphicon glyphicon-th-list"
              onClick={() => setShow?.(true)}
            />
          </div>
          <div className={styles.title}>
            <span className={styles.titleText} onClick={handleHomeClick}>
              MeeMeals
            </span>
          </div>
          <div className={styles.leftover}>
            <div className={styles.leftoverIcon}>
              <span className="glyphicon glyphicon-user" onClick={logout} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.title}>
            <span className={styles.titleText} onClick={handleHomeClick}>
              MeeMeals
            </span>
          </div>
          <div className={styles.leftover}>
            <div className={styles.leftoverIcon}>
              <span className="glyphicon glyphicon-user" onClick={logout} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
