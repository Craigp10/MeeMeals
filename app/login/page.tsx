"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Button } from "react-bootstrap";
import { useUser } from "@/context/user-context";
import { useWindowSize } from "@/context/window-size-context";
import styles from "./login.module.scss";

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, login, isLoading } = useUser();
  const windowSize = useWindowSize();
  const [loginSuccess, setLoginSuccess] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const MOBILE_VIEW = windowSize.width <= 768;

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleUserSubmit = async () => {
    if (!usernameRef.current || !passwordRef.current) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameRef.current.value,
          password: passwordRef.current.value,
        }),
      });

      const data = await response.json();

      if (response.ok && data.id) {
        setLoginSuccess(true);
        login({
          id: data.id,
          username: data.username,
          email: data.email,
        });
        router.replace("/dashboard");
      } else {
        setLoginSuccess(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/demo");
      const data = await response.json();

      if (response.ok && data.id) {
        setLoginSuccess(true);
        login({
          id: data.id,
          username: data.username,
          email: data.email,
        });
        router.replace("/dashboard");
      } else {
        setLoginSuccess(false);
      }
    } catch (error) {
      console.error("Demo login error:", error);
      setLoginSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginBoard}>
        <div className={styles.loginContent}>
          <h3>Log In</h3>
          <form
            className={styles.loginForm}
            onSubmit={(e) => {
              e.preventDefault();
              handleUserSubmit();
            }}
          >
            <Form.Group className={styles.formField} controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                ref={usernameRef}
                disabled
              />
            </Form.Group>
            <Form.Group className={styles.formField} controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="password"
                ref={passwordRef}
                disabled
              />
            </Form.Group>
            <hr />
            <div className={styles.formButtons}>
              <Button
                type="submit"
                id="user-login"
                name="user"
                size={MOBILE_VIEW ? "sm" : "lg"}
                disabled
              >
                Log In
              </Button>
              <Button
                type="button"
                id="demo-login"
                name="demo"
                onClick={handleDemoSubmit}
                size={MOBILE_VIEW ? "sm" : "lg"}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading..." : "Demo Log In"}
              </Button>
            </div>
          </form>
          <span
            className={`${styles.failedMessage} ${loginSuccess ? styles.inactive : ""}`}
          >
            Failed to login.
          </span>
          <div className={styles.demoMessage}>
            <span>
              Explore meemeals as a demo user by clicking `Demo Log in`.
              Currently only demo users are supported.
            </span>
          </div>
          <div className={styles.accountOptions}>
            <p style={{ textDecoration: "line-through" }}>
              Forgot your password?{MOBILE_VIEW ? <br /> : <>&nbsp;</>}
              <Link href="/recover-password" style={{ pointerEvents: "none" }}>
                Click here
              </Link>
              .
            </p>
            <p style={{ textDecoration: "line-through" }}>
              Don&apos;t have an account?{MOBILE_VIEW ? <br /> : <>&nbsp;</>}
              <Link href="/create-account" style={{ pointerEvents: "none" }}>
                Create an account
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
