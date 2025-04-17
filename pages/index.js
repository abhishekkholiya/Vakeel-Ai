import Head from "next/head";
import Image from "next/image";
<<<<<<< HEAD
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Navbar from "./components/Navbar";
import { ReactTyped } from "react-typed";
import * as motion from 'motion/react-client';
import Footer from "./components/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
=======
import { Inter } from "next/font/google";
import styles from "@/styles/Login.module.css";
import React, { useEffect, useState } from "react";
import { ReactTyped } from "react-typed";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });
>>>>>>> af91508c8e16bd48362bf33da3169e58c9a5b667

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, signup, googleSignIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
<<<<<<< HEAD
        <Head>
          <title>Vakeel Ai</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />

          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
          <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Istok+Web:ital,wght@0,400;0,700;1,400;1,700&family=Joan&display=swap" rel="stylesheet"></link>
        </Head>
          <>
              <div className={`${styles.hero_page}`}> 
                  <Navbar/>
                  <main className={styles.main}>
                    <motion.div   
                    // initial={{ opacity: 0, scale: 0.8, y: 50 }} // Start slightly smaller and lower
                    //   whileInView={{ opacity: 1, scale: 1, y: 1 }} // Pop up to normal size
                    //   transition={{ duration: 1.2, ease: "easeOut" }} // Control the speed and smoothness 
                      className={styles.main_content}>
                          <div className={styles.main_content_left}>
                                <div className={styles.main_logo_container}>
                                      <img src="/advocate.png" width={60} height={80}/>
                                      <h2 className={styles.main_logo_header}>Vakeel Ai</h2>
                                </div>
                                <h2 className={styles.main_sub_header}>democratising law <br/> knowledge & 🔍 research </h2>

                                <div className={styles.main_action_button}>
                                    <p className={styles.main_action_button_text}>Try Now</p>
                                </div>
                            
                          </div>
                          <div className={styles.main_content_right}>

                                <div className={styles.main_image_container}>
                                    <img className={styles.phone_image} src="/phone.png" width={50} height={100}/>
                                </div>
                          </div>
                    </motion.div>
                  </main>
              </div>

              <div className={styles.features_page}>
                    <h2 className={styles.features_page_header}>Features like  no place else!</h2>
                    <div className={styles.feature_div}>
                        <div className={styles.feature_div_left}>
                            <h2 className={styles.feature_div_header}>
                              Deep Legal <br/> Research
                            </h2>
                            <p className={styles.feature_div_description}>
                               Search through lakhs of real court judgments across the Supreme Court, High Courts, and District Courts.
                            </p>
                        </div>
                        <div className={`${styles.feature_div_right} ${styles.feature_image_one} `}>
                            <h2 className={styles.feature_div_logo}>🔍 Search</h2>
                        </div>
                    </div>



                    <div className={styles.feature_div_two}>
                       
                        <div className={`${styles.feature_div_two_left} ${styles.feature_image_two} `}>
                           <img src="/contract.png" width={95} height={95}/>
                        </div>
                        <div className={styles.feature_div_two_right}>
                            <h2 className={styles.feature_div_header}>
                              AI Case <br/> Summaries
                            </h2>
                            <p className={styles.feature_div_description}>
                              No more legal jargon. <br/> Easy to understand summaries tailored for lawyers & common man. 
                            </p>
                        </div>
                    </div>

                    <div className={styles.feature_div}>
                        <div className={styles.feature_div_left}>
                            <h2 className={styles.feature_div_header}>
                              Ask questions in <br/> Simple language
                            </h2>
                            <p className={styles.feature_div_description}>
                              “a case of couples fighting”
                            </p>
                        </div>
                        <div className={`${styles.feature_div_right} ${styles.feature_image_three} `}>
                            <h2 className={styles.feature_div_logo}>🙋</h2>
                        </div>
                    </div>

                    <div className={styles.feature_div_two}>
                       
                       <div className={`${styles.feature_div_two_left} ${styles.feature_image_four} `}>
                          <h2 className={styles.feature_div_logo}>📁</h2>
                       </div>
                       <div className={styles.feature_div_two_right}>
                           <h2 className={styles.feature_div_header}>
                              Auto Generated <br/> Case Notes
                           </h2>
                           <p className={styles.feature_div_description}>
                             No more legal jargon. <br/> Easy to understand summaries tailored for lawyers & common man. 
                           </p>
                       </div>
                   </div>

                   <Footer/>
              </div>
             

              


          </>
=======
      <Head>
        <title>Vakeel AI - Login</title>
        <meta name="description" content="Login to Vakeel AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <h1 className={styles.title}>Draft an email to request legal advice</h1>
          {mounted && (
            <div className={styles.typingText}>
              <ReactTyped
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
        </div>
        <div className={styles.rightSection}>
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
            <h2 className={styles.subtitle}>
              {isLogin ? "Log in" : "Sign up"}
            </h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
              <div className={styles.buttonContainer}>
                <button
                  type="submit"
                  className={`${styles.button} ${styles.primaryButton}`}
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className={`${styles.button} ${styles.secondaryButton}`}
                >
                  {isLogin
                    ? "Need an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className={`${styles.button} ${styles.googleButton}`}
                >
                  Sign in with Google
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
>>>>>>> af91508c8e16bd48362bf33da3169e58c9a5b667
    </>
  );
}