import { auth, db } from "./firebase.js";

import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


export let currentProfile = null;


export function guardPage(callback){
  onAuthStateChanged(auth, async user => {
    if(!user){ location.href="login.html";  return;  }
    const snap = await getDoc(doc(db,"users",user.uid)); 
    currentProfile = snap.exists() ? snap.data() : {name:user.displayName || "Student", username:"student"}; 
    document.querySelectorAll("[data-user-name]").forEach(e=>e.textContent=currentProfile.name || "Student"); 
    document.querySelectorAll("[data-user-username]").forEach(e=>e.textContent="@"+(currentProfile.username || "student")); 
    const initials=(currentProfile.name||"S").split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase(); 
    document.querySelectorAll("[data-avatar]").forEach(e=>e.textContent=initials); 
    if(callback) callback(user,currentProfile); 
  });

}
export function setupShell(){
  document.querySelector(".mobile-menu")?.addEventListener("click",()=>document.querySelector(".sidebar")?.classList.toggle("open"));

  document.querySelector("#logout")?.addEventListener("click",async()=>{await signOut(auth); location.href="login.html"; });

}
export function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp; ","<":"&lt; ",">":"&gt; ",'"':"&quot;","'":"&#039; "}[c]));}
export function fmt(ts){
  if(!ts) return "just now";
  const d=ts.toDate?ts.toDate():new Date(ts);
  return d.toLocaleString([], {dateStyle:"medium",timeStyle:"short"});
}
export const TAGS=["LostFound","CampusPlacement","Events","Hostel","News","Sports","Academics","General"];
