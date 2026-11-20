import {auth,db} from "./firebase.js";

import {collection,addDoc,query,orderBy,onSnapshot,serverTimestamp,deleteDoc,doc} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {guardPage,setupShell,esc,fmt,TAGS} from "./common.js";

let messages=[],selected=[];

const tagBox=document.querySelector("#tag-box");

function renderTags(){tagBox.innerHTML=TAGS.map(t=>`<button class="tag tag-btn" data-tag="${t}">#${t}</button>`).join("");
document.querySelectorAll(".tag-btn").forEach(b=>b.onclick=()=>{b.classList.toggle("selected"); b.style.outline=b.classList.contains("selected")?"2px solid #818cf8":"none"; });
}
function render(){
 const term=document.querySelector("#search").value.toLowerCase();

 const filter=document.querySelector("#filter").value;

 const arr=messages.filter(m=>(!term||m.text.toLowerCase().includes(term)||m.name.toLowerCase().includes(term))&&(!filter||m.tags?.includes(filter)));

 document.querySelector("#messages").innerHTML=arr.length?arr.map(m=>`<div class="message"><div class="message-head"><div class="message-name">${esc(m.name)}</div><div class="message-time">${fmt(m.createdAt)}</div></div><div class="message-text">${esc(m.text)}</div><div class="tags">${(m.tags||[]).map(t=>`<span class="tag">#${esc(t)}</span>`).join("")}</div>${m.uid===auth.currentUser?.uid?`<div class="message-actions" style="margin-top:8px"><button class="btn danger small delete-msg" data-id="${m.id}">Delete</button></div>`:""}</div>`).join(""):`<div class="empty">No messages found.</div>`;

 document.querySelectorAll(".delete-msg").forEach(b=>b.onclick=async()=>{if(confirm("Delete this message?"))await deleteDoc(doc(db,"messages",b.dataset.id))});

}
guardPage((user,profile)=>{
 setupShell(); renderTags(); 
 document.querySelector("#filter").innerHTML=`<option value="">All tags</option>`+TAGS.map(t=>`<option value="${t}">#${t}</option>`).join(""); 
 onSnapshot(query(collection(db,"messages"),orderBy("createdAt","desc")),s=>{messages=s.docs.map(d=>({id:d.id,...d.data()})); render()}); 
 document.querySelector("#search").oninput=render; document.querySelector("#filter").onchange=render; 
 document.querySelector("#send").onclick=async()=>{
  const text=document.querySelector("#text").value.trim();  selected=[...document.querySelectorAll(".tag-btn.selected")].map(x=>x.dataset.tag); 
  if(!text)return; 
  await addDoc(collection(db,"messages"),{uid:user.uid,name:profile.name||"Student",text,tags:selected.length?selected:["General"],createdAt:serverTimestamp()}); 
  document.querySelector("#text").value=""; document.querySelectorAll(".tag-btn").forEach(x=>{x.classList.remove("selected"); x.style.outline="none"}); 
 }; 
});
