
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  doc,
  serverTimestamp,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const $ = (selector) => document.querySelector(selector);

const showMessage = (message, type = "error") => {
  const element = $("#message");

  if (!element) return;

  element.textContent = message;
  element.className = `alert ${type === "success" ? "success" : "error"}`;
  element.hidden = false;
};

const getErrorMessage = (error) => {
  if (!error || !error.message) {
    return "Something went wrong. Please try again.";
  }

  return error.message.replace("Firebase: ", "");
};

const handleSubmit = async (event, callback) => {
  event.preventDefault();

  try {
    await callback();
  } catch (error) {
    showMessage(getErrorMessage(error));
  }
};

$("#register-form")?.addEventListener("submit", (event) => {
  handleSubmit(event, async () => {
    const name = $("#name")?.value.trim() ?? "";
    const username = $("#username")?.value.trim() ?? "";
    const email = $("#email")?.value.trim() ?? "";
    const password = $("#password")?.value ?? "";
    const confirmPassword = $("#confirm")?.value ?? "";

    if (!name || !username || !email || !password) {
      showMessage("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Passwords do not match.");
      return;
    }

    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(user, { displayName: name });
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      username,
      email,
      bio: "",
      course: "",
      year: "",
      photoURL: "",
      postsCount: 0,
      commentsCount: 0,
      role: "user",
      createdAt: serverTimestamp(),
    });

    window.location.href = "chat.html";
  });
});

$("#login-form")?.addEventListener("submit", (event) => {
  handleSubmit(event, async () => {
    const email = $("#email")?.value.trim() ?? "";
    const password = $("#password")?.value ?? "";

    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "chat.html";
  });
});

$("#reset-form")?.addEventListener("submit", (event) => {
  handleSubmit(event, async () => {
    const email = $("#email")?.value.trim() ?? "";

    await sendPasswordResetEmail(auth, email);
    showMessage("Password reset email sent.", "success");
  });
});
