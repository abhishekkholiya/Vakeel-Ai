import Head from "next/head";
import Image from "next/image";
import { Geist } from "next/font/google";
import styles from "@/styles/Login.module.css";
import { useEffect, useState } from "react";
import Typed from "react-typed";

const geist = Geist({
  subsets: ["latin"],
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Vakeel AI - Login</title>
        <meta name="description" content="Login to Vakeel AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.container} ${geist.className}`}>
        <div className={styles.loginCard}>
          <div className={styles.logo}>
            <Image
              src="/vakeel-logo.svg"
              alt="Vakeel AI Logo"
              width={120}
              height={120}
              priority
            />
          </div>
          <h1 className={styles.title}>Welcome to Vakeel AI</h1>
          {mounted && (
            <div className={styles.typingText}>
              <Typed
                strings={[
                  "Your AI-powered legal assistant",
                  "Get instant legal advice",
                  "Analyze legal documents efficiently",
                  "Stay compliant with ease",
                ]}
                typeSpeed={40}
                backSpeed={50}
                loop
              />
            </div>
          )}
          <div className={styles.buttonContainer}>
            <button className={`${styles.button} ${styles.primaryButton}`}>
              Sign In
            </button>
            <button className={`${styles.button} ${styles.secondaryButton}`}>
              Create Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
