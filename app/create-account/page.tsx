"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Button } from "react-bootstrap";
import { useUser } from "@/context/user-context";
import { useWindowSize } from "@/context/window-size-context";
import styles from "./create-account.module.scss";

const badPasswords: (string | null)[] = ["", null];
const badUsernames: (string | null)[] = ["", "demo", null];
const badEmails: (string | null)[] = ["", "demo@gmail.com", null];

export default function CreateAccountPage() {
  const router = useRouter();
  const { isAuthenticated, login, isLoading: authLoading } = useUser();
  const windowSize = useWindowSize();
  const [createSuccess, setCreateSuccess] = useState<boolean | null>(true);
  const [isLoading, setIsLoading] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const MOBILE_VIEW = windowSize.width <= 768;

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  const validateCreateAccount = () => {
    if (!usernameRef.current || !emailRef.current || !passwordRef.current) {
      return false;
    }
    return !(
      badPasswords.includes(passwordRef.current.value) ||
      badUsernames.includes(usernameRef.current.value) ||
      badEmails.includes(emailRef.current.value)
    );
  };

  const handleCreateAccount = async () => {
    if (!usernameRef.current || !emailRef.current || !passwordRef.current) return;

    setIsLoading(true);

    if (!validateCreateAccount()) {
      setCreateSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      // Create account
      const signupResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
        }),
      });

      const signupData = await signupResponse.json();

      if (signupResponse.ok && signupData.success) {
        // Auto-login after signup
        const signinResponse = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: usernameRef.current.value,
            password: passwordRef.current.value,
          }),
        });

        const signinData = await signinResponse.json();

        if (signinResponse.ok && signinData.id) {
          login({
            id: signinData.id,
            username: signinData.username,
            email: signinData.email,
          });
          router.replace("/dashboard");
        } else {
          setCreateSuccess(false);
        }
      } else {
        setCreateSuccess(false);
      }
    } catch (error) {
      console.error("Create account error:", error);
      setCreateSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.board}>
        <div className={styles.content}>
          <h3>Create Account</h3>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateAccount();
            }}
          >
            <Form.Group className={styles.formField} controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a username"
                ref={usernameRef}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className={styles.formField} controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                ref={emailRef}
              />
            </Form.Group>
            <Form.Group className={styles.formField} controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter A Password"
                ref={passwordRef}
              />
            </Form.Group>
            <hr />
            <div className={styles.formButtons}>
              <Button
                type="submit"
                name="createBtn"
                disabled={isLoading}
                size={MOBILE_VIEW ? "sm" : "lg"}
              >
                {isLoading ? "Creating..." : "Create Account!"}
              </Button>
            </div>
          </form>
          {!createSuccess && (
            <span className={styles.failedMessage}>
              Failed to create account.
            </span>
          )}
          <div className={styles.recover}>
            Already have an account?{" "}
            <Link href="/login">Sign in</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
