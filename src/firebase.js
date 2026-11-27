import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider
} from "firebase/app-check";
const firebaseConfig = {
  apiKey: "AIzaSyCHnvwPAcGJOry9G734kbSedlRJYRE2dP4",
  authDomain: "cargospaceai.firebaseapp.com",
  projectId: "cargospaceai",
  storageBucket: "cargospaceai.firebasestorage.app",
  messagingSenderId: "341942805451",
  appId: "1:341942805451:web:3b75b51c9ae5eb5b2f8c4e",
  measurementId: "G-KJEYR4W90T"
};

const app = initializeApp(firebaseConfig);
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY
  ),
  isTokenAutoRefreshEnabled: true
});
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;