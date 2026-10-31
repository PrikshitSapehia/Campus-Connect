
import {auth,db} from "./firebase.js";
import {collection,getDocs,query,orderBy,updateDoc,doc,deleteDoc} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import {guardPage,setupShell,esc,fmt} from "./common.js";
guardPage(async(user,p)=>{
 setupShell();
 if(p.role!=="admin"){document.querySelector("#admin-content").innerHTML='<div class="card"><h2>Access denied</h2><p class="muted">This page is only for administrators.</p></div>';return}
 const [us,ms,ps,rs]=await Promise.all([getDocs(collection(db,"users")),getDocs(collection(db,"messages")),getDocs(collection(db,"posts")),getDocs(collection(db,"reports"))]);
 $("#users-count").textContent=us.size;$("#messages-count").textContent=ms.size;$("#posts-count").textContent=ps.size;$("#reports-count").textContent=rs.docs.filter(x=>x.data().status==="pending").length;
 $("#reports").innerHTML=rs.docs.map(x=>{const r=x.data();return `<tr><td>${esc(r.name||"User")}</td><td>${esc(r.reason||"")}</td><td>${fmt(r.createdAt)}</td><td>${esc(r.status||"pending")}</td><td>${r.status==="pending"?`<button class="btn secondary dismiss" data-id="${x.id}">Dismiss</button>`:"—"}</td></tr>`}).join("")||'<tr><td colspan="5">No reports.</td></tr>';
 document.querySelectorAll(".dismiss").forEach(b=>b.onclick=async()=>{await updateDoc(doc(db,"reports",b.dataset.id),{status:"dismissed"});location.reload()});
});
