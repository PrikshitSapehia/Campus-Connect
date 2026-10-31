
import {auth,db} from "./firebase.js";
import {doc,getDoc,setDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import {guardPage,setupShell,esc} from "./common.js";
guardPage(async(user,p)=>{
 setupShell();const s=await getDoc(doc(db,"users",user.uid));const d=s.data()||p;
 $("#name").value=d.name||"";$("#username").value=d.username||"";$("#bio").value=d.bio||"";$("#course").value=d.course||"";$("#year").value=d.year||"";
 $("#save").onclick=async()=>{await setDoc(doc(db,"users",user.uid),{...d,name:$("#name").value.trim(),username:$("#username").value.trim(),bio:$("#bio").value.trim(),course:$("#course").value.trim(),year:$("#year").value.trim()},{merge:true});$("#message").hidden=false;$("#message").textContent="Profile saved.";$("#message").className="alert success"};
});
function $(s){return document.querySelector(s)}
