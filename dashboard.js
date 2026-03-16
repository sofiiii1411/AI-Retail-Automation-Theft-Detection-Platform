import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {

apiKey: "AIzaSyAcNfdzVTSrwM3SoSF-H4azWeiitE0Ypoo",
authDomain: "retailpulseai-e2a4a.firebaseapp.com",
databaseURL: "https://retailpulseai-e2a4a-default-rtdb.firebaseio.com",
projectId: "retailpulseai-e2a4a",
storageBucket: "retailpulseai-e2a4a.appspot.com",
messagingSenderId: "49458527888",
appId: "1:49458527888:web:57d854b575ecbbe890e215"

};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const billsRef = ref(db,"billing_records");

let chart;

onValue(billsRef,(snapshot)=>{

let sales = 0;
let bills = 0;
let customers = new Set();

let labels=[];
let data=[];

snapshot.forEach((child)=>{

let bill = child.val();

let amount = Number(bill.total) || 0;

sales += amount;

bills++;

if(bill.phone){

customers.add(bill.phone);

}

labels.push(child.key);
data.push(amount);

});

document.getElementById("sales").innerText = "₹"+sales;
document.getElementById("bills").innerText = bills;
document.getElementById("customers").innerText = customers.size;

updateChart(labels,data);

});

function updateChart(labels,data){

const ctx=document.getElementById("salesChart");

if(chart){
chart.destroy();
}

chart=new Chart(ctx,{

type:'line',

data:{
labels:labels,
datasets:[{
label:'Sales ₹',
data:data,
borderColor:'#1e90ff',
backgroundColor:'rgba(30,144,255,0.2)',
fill:true,
tension:0.3
}]
},

options:{
responsive:true,
scales:{
y:{
beginAtZero:true
}
}
}

});

}