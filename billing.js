import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js"

const firebaseConfig = {
apiKey: "AIzaSyAcNfdzVTSrwM3SoSF-H4azWeiitE0Ypoo",
authDomain: "retailpulseai-e2a4a.firebaseapp.com",
databaseURL: "https://retailpulseai-e2a4a-default-rtdb.firebaseio.com",
projectId: "retailpulseai-e2a4a",
storageBucket: "retailpulseai-e2a4a.firebasestorage.app",
messagingSenderId: "49458527888",
appId: "1:49458527888:web:57d854b575ecbbe890e215"
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

let bill=[]
let total=0

const shopID="SHOP001"

const table=document.getElementById("billTable")

/* ENTER KEY NAVIGATION */

document.getElementById("phone").addEventListener("keydown",function(e){

if(e.key==="Enter"){
validatePhone()
}

})

document.getElementById("product").addEventListener("keydown",function(e){

if(e.key==="Enter"){
document.getElementById("price").focus()
}

})

document.getElementById("price").addEventListener("keydown",function(e){

if(e.key==="Enter"){
document.getElementById("qty").focus()
}

})

document.getElementById("qty").addEventListener("keydown",function(e){

if(e.key==="Enter"){
addProduct()
}

})

/* PHONE VALIDATION */

function validatePhone(){

let phone=document.getElementById("phone").value

if(phone.length!==10 || isNaN(phone)){
alert("Invalid phone number. Enter 10 digits.")
return
}

document.getElementById("product").focus()

}

/* ADD PRODUCT */

document.getElementById("addBtn").onclick=addProduct

function addProduct(){

let product=document.getElementById("product").value
let price=parseFloat(document.getElementById("price").value)
let qty=parseInt(document.getElementById("qty").value)

if(!product||!price||!qty){
alert("Enter product details")
return
}

let itemTotal=price*qty

bill.push({product,price,qty,total:itemTotal})

total+=itemTotal

updateTable()

document.getElementById("product").value=""
document.getElementById("price").value=""
document.getElementById("qty").value=""

document.getElementById("product").focus()

}

/* UPDATE BILL TABLE */

function updateTable(){

table.innerHTML=""

bill.forEach(i=>{

table.innerHTML+=`
<tr>
<td>${i.product}</td>
<td>${i.qty}</td>
<td>${i.price}</td>
<td>${i.total}</td>
</tr>
`

})

document.getElementById("total").innerHTML="Total: ₹"+total

}

/* GENERATE QR */

document.getElementById("generateQR").onclick=function(){

document.getElementById("qrcode").innerHTML=""

new QRCode(document.getElementById("qrcode"),{

text:"upi://pay?pa=demo@upi&pn=RetailStore&am="+total,
width:200,
height:200

})

}

/* CONFIRM PAYMENT */

document.getElementById("confirmPayment").onclick=function(){

let paid=confirm("Has the customer completed payment?")

let status=paid?"PAID":"UNPAID"

saveBill(status)

}

/* SAVE BILL */

function saveBill(status){

let phone=document.getElementById("phone").value

let billID="BILL-"+Math.floor(Math.random()*100000)

let customerID="CUST-"+phone.slice(-4)

let now=new Date()

let date=
now.getDate().toString().padStart(2,'0')+"-"+
(now.getMonth()+1).toString().padStart(2,'0')+"-"+
now.getFullYear()

let time=now.toLocaleTimeString()

let data={

shopID:shopID,
billID:billID,
customerID:customerID,
phone:phone,
items:bill,
total:total,
payment:document.getElementById("payment").value,
status:status,
date:date,
time:time

}

set(ref(db,"billing_records/"+billID),data)

alert(

"Bill saved successfully\n\n"+
"ShopID: "+shopID+"\n"+
"BillID: "+billID+"\n"+
"CustomerID: "+customerID+"\n"+
"Saved to Firebase"

)

bill=[]
total=0

updateTable()

}

/* LOAD CUSTOMER HISTORY */

document.getElementById("loadHistory").onclick=function(){

let phone=document.getElementById("phone").value

if(phone.length!==10){
alert("Enter valid phone first")
return
}

const dbRef=ref(db)

get(child(dbRef,"billing_records")).then(snapshot=>{

let historyHTML="<h3>Customer History</h3>"

snapshot.forEach(childSnapshot=>{

let data=childSnapshot.val()

if(data.phone===phone){

historyHTML+=`

<div>

<b>BillID:</b> ${data.billID || "N/A"} <br>
<b>Date:</b> ${data.date || "N/A"} <br>
<b>Time:</b> ${data.time || "N/A"} <br>
<b>Total:</b> ₹${data.total ?? 0} <br>
<b>Payment:</b> ${data.payment ?? "N/A"} <br>
<b>Status:</b> ${data.status ?? "N/A"}

<hr>

</div>

`

}

})

document.getElementById("history").innerHTML=historyHTML

})

}