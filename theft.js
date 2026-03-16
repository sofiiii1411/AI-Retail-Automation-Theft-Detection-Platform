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

const theftRef = ref(db,"theft_alert");

onValue(theftRef,(snapshot)=>{

let data = snapshot.val();

if(data && data.status === "THEFT"){

document.getElementById("alert").style.display="block";

}

});