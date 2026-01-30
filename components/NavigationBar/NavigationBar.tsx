"use client";

import Link from "next/link";
import { useWindowSize } from "@/context/window-size-context";
import styles from "./NavigationBar.module.scss";

interface Props {
  show: boolean;
  setShow?: (value: boolean) => void;
}

export default function NavigationBar({ show, setShow }: Props) {
  const windowSize = useWindowSize();

  const hideNavBar = () => {
    setShow?.(false);
  };

  const wrapperClass =
    windowSize.width < 1024 && show
      ? `${styles.wrapper} ${styles.shown}`
      : `${styles.wrapper} ${styles.notShown}`;

  return (
    <div className={wrapperClass}>
      {windowSize.width < 1024 && (
        <div className={styles.mobile}>
          <span className="glyphicon glyphicon-remove" onClick={hideNavBar} />
        </div>
      )}
      <ul className={styles.linklist} onClick={hideNavBar}>
        <li>
          <Link className={styles.link} href="/dashboard">
            Home
          </Link>
        </li>
        <li>
          <Link className={styles.link} href="/dashboard/meals">
            Meals
          </Link>
        </li>
        <li>
          <Link className={styles.link} href="/dashboard/calendar">
            Calendar
          </Link>
        </li>
      </ul>
    </div>
  );
}
