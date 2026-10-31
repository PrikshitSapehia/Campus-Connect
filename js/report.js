
import {auth,db} from "./firebase.js";
import {addDoc,collection,serverTimestamp} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import {guardPage,setupShell} from "./common.js";
guardPage((user,profile)=>{setupShell();$("#report-form").onsubmit=async e=>{e.preventDefault();await addDoc(collection(db,"reports"),{uid:user.uid,name:profile.name,reason:$("#reason").value,details:$("#details").value.trim(),createdAt:serverTimestamp(),status:"pending"});$("#message").hidden=false;$("#message").textContent="Report submitted.";$("#message").className="alert success";$("#report-form").reset()}})
function $(s){return document.querySelector(s)}
