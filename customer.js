import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
apiKey: "AIzaSyAcNfdzVTSrwM3SoSF-H4azWeiitE0Ypoo",
authDomain: "retailpulseai-e2a4a.firebaseapp.com",
databaseURL: "https://retailpulseai-e2a4a-default-rtdb.firebaseio.com",
projectId: "retailpulseai-e2a4a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.loadCustomer = function(){

let phone = document.getElementById("phone").value;

let visits = 0;
let spent = 0;
let historyHTML = "";

const dbRef = ref(db);

get(child(dbRef,"billing_records")).then(snapshot=>{

snapshot.forEach(childSnapshot=>{

let data = childSnapshot.val();
let billId = childSnapshot.key;

if(data.phone === phone){

visits++;

let amount = Number(data.total);
spent += amount;

historyHTML += `
<div class="bill">
<span>${billId}</span>
<span>${data.date}</span>
<span>₹${amount}</span>
<span>${data.payment}</span>
</div>
`;

}

});

let avgBill = visits > 0 ? (spent/visits).toFixed(2) : 0;
let rewardPoints = Math.floor(spent / 10);

document.getElementById("customer").innerHTML = phone;
document.getElementById("visits").innerHTML = visits;
document.getElementById("spent").innerHTML = "₹" + spent;
document.getElementById("avg").innerHTML = "₹" + avgBill;
document.getElementById("points").innerHTML = rewardPoints + " ⭐";

document.getElementById("history").innerHTML =
historyHTML || "No purchase history found.";

});

};


document.addEventListener("DOMContentLoaded",function(){

document.getElementById("phone").addEventListener("keypress",function(event){

if(event.key==="Enter"){

event.preventDefault();
loadCustomer();

}

});

});