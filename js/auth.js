import { auth, db } from "./firebase.js";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const $=s=>document.querySelector(s);

function msg(t,type="error"){const e=$("#message");
if(e){e.textContent=t;
e.className="alert "+(type==="success"?"success":"error");
e.hidden=false}}

$("#register-form")?.addEventListener("submit",async e=>{
 e.preventDefault(); 
 const name=$("#name").value.trim(),username=$("#username").value.trim(),email=$("#email").value.trim(),pass=$("#password").value,confirm=$("#confirm").value; 
 if(!name||!username||!email||!pass)return msg("Please fill all fields."); 
 if(pass!==confirm)return msg("Passwords do not match."); 
 try{
  const {user}=await createUserWithEmailAndPassword(auth,email,pass); 
  await updateProfile(user,{displayName:name}); 
  await setDoc(doc(db,"users",user.uid),{uid:user.uid,name,username,email,bio:"",course:"",year:"",photoURL:"",postsCount:0,commentsCount:0,role:"user",createdAt:serverTimestamp()}); 
  location.href="chat.html"; 
 }catch(err){msg(err.message.replace("Firebase: ",""))}
});


$("#login-form")?.addEventListener("submit",async e=>{
 e.preventDefault();  const email=$("#email").value.trim(),pass=$("#password").value; 
 try{await signInWithEmailAndPassword(auth,email,pass); location.href="chat.html"}catch(err){msg(err.message.replace("Firebase: ",""))}
});

$("#reset-form")?.addEventListener("submit",async e=>{
 e.preventDefault(); try{await sendPasswordResetEmail(auth,$("#email").value.trim()); msg("Password reset email sent.","success")}catch(err){msg(err.message.replace("Firebase: ",""))}
});
