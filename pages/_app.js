<<<<<<< HEAD
import "@/styles/globals.css";
import { AuthProvider } from "./context/AuthContext";
export default function App({ Component, pageProps }) {
  return <AuthProvider>
      <Component {...pageProps} />
  </AuthProvider>
=======
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
>>>>>>> af91508c8e16bd48362bf33da3169e58c9a5b667
}

export default MyApp;
