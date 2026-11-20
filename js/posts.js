import {auth,db} from "./firebase.js";

import {collection,addDoc,query,orderBy,onSnapshot,serverTimestamp,deleteDoc,doc,updateDoc,arrayUnion,arrayRemove} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {guardPage,setupShell,esc,fmt,TAGS} from "./common.js";

let posts=[];

guardPage((user,profile)=>{
 setupShell(); 
 document.querySelector("#post-tags").innerHTML=TAGS.map(t=>`<label class="tag"><input type="checkbox" value="${t}"> #${t}</label>`).join(""); 
 onSnapshot(query(collection(db,"posts"),orderBy("createdAt","desc")),s=>{posts=s.docs.map(d=>({id:d.id,...d.data()})); render()}); 
 document.querySelector("#post-search").oninput=render; document.querySelector("#post-filter").innerHTML=`<option value="">All tags</option>`+TAGS.map(t=>`<option value="${t}">#${t}</option>`).join(""); document.querySelector("#post-filter").onchange=render; 
 document.querySelector("#create-post").onclick=async()=>{
  const title=$("#title").value.trim(),body=$("#body").value.trim(),tags=[...document.querySelectorAll("#post-tags input:checked")].map(x=>x.value); 
  if(!title||!body)return alert("Add a title and description."); 
  await addDoc(collection(db,"posts"),{uid:user.uid,name:profile.name||"Student",title,body,tags:tags.length?tags:["General"],likes:[],createdAt:serverTimestamp()}); 
  $("#title").value=""; $("#body").value=""; 
 }; 
});

function $(s){return document.querySelector(s)}
function render(){
 const term=$("#post-search").value.toLowerCase(),f=$("#post-filter").value;

 const arr=posts.filter(p=>(!term||(p.title+p.body).toLowerCase().includes(term))&&(!f||p.tags?.includes(f)));

 $("#posts").innerHTML=arr.length?arr.map(p=>`<article class="post"><div class="post-meta"><b>${esc(p.name)}</b> · ${fmt(p.createdAt)}</div><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p><div class="tags">${(p.tags||[]).map(t=>`<span class="tag">#${esc(t)}</span>`).join("")}</div><div style="display:flex;gap:8px;margin-top:13px"><button class="btn secondary like" data-id="${p.id}">♥ ${p.likes?.length||0}</button>${p.uid===auth.currentUser?.uid?`<button class="btn danger delete" data-id="${p.id}">Delete</button>`:""}</div></article>`).join(""):`<div class="empty">No posts found.</div>`;

 document.querySelectorAll(".like").forEach(b=>b.onclick=async()=>{const p=posts.find(x=>x.id===b.dataset.id); const liked=p.likes?.includes(auth.currentUser.uid); await updateDoc(doc(db,"posts",p.id),{likes:liked?arrayRemove(auth.currentUser.uid):arrayUnion(auth.currentUser.uid)})});

 document.querySelectorAll(".delete").forEach(b=>b.onclick=async()=>{if(confirm("Delete post?"))await deleteDoc(doc(db,"posts",b.dataset.id))});

}
