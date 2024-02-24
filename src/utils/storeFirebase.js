import {
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { encryptData } from "./shortenAddress";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "invaria-kyc.firebaseapp.com",
  projectId: "invaria-kyc",
  storageBucket: "invaria-kyc.appspot.com",
  messagingSenderId: "657214210738",
  appId: "1:657214210738:web:ac00d0316118c02ae4bfab",
  measurementId: "G-GG5K9WCNRQ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const applyWhite = async (user, data) => {
  const usersCollectionRef = collection(db, "applywhite");
  await setDoc(doc(usersCollectionRef, String(user)), data, { merge: true });
  console.log("applied");
  return "created";
};

export const getWhite = async (address) => {
  const usersCollectionRef = collection(db, "applywhite");
  const q = query(usersCollectionRef, where("address", "==", address));
  let alldocs=[];
  const querySnapshota = await getDocs(q);
  let data;
  querySnapshota.forEach((doc) => {
    data={};
    data = doc.data()
    data.date2 = new Date((data.date.seconds) * 1000)
    data.millisec =new Date((data.date.seconds) * 1000).getTime();
    alldocs.push(data);
  });
  return alldocs;
}

export const createUser = async (user, data) => {
  const usersCollectionRef = collection(db, "invaria");
  await setDoc(doc(usersCollectionRef, String(user)), data, { merge: true });
  console.log("createUser");
  return "created";
};

export const getUser = async (address) => {
  const usersCollectionRef = collection(db, "invaria");
  const q = query(usersCollectionRef, where("address", "==", address));
  // const q = query(usersCollectionRef, where("address", "==", "0x252CB346c174ad1471532CDCAF3A74229E9d2d6F"));
  //0xd33f4E98D16318e47dcC381345B4B408E02b6a92 //0xA450cC0A298d99C2794b2F26b9f8e4302a8fE5e1
  //0x252CB346c174ad1471532CDCAF3A74229E9d2d6F
  // console.log("q", q)
  const querySnapshota = await getDocs(q);
  let state = "Unverified";
  let realState, realResult;
  let stateCode = 404;
  querySnapshota.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log("doc", doc.data(), doc.data().audit_status);
    if (doc.data().audit_status !== undefined) {
      // console.log("state un ", state, doc.data().state)
      // console.log(doc.data().audit_status, doc.data().reject_reasons)

      if (doc.data().audit_status == "Accepted") {
        state = "Accepted";
        // console.log("state ac ", state)
      } else if (
        state !== "Accepted" &&
        doc.data().audit_status == "Rejected"
      ) {
        state = "Rejected";
        // console.log("state rej ", state)
      } else if (
        doc.data().audit_status == "Pending" &&
        doc.data().reject_reasons.length == 0
      ) {
        state = "Pending";
        // console.log("state pend", state)
      }
    }
  });
  // console.log("re", stateCode, state)
  return state;
};

export const getUserData = async (address) => {
  const usersCollectionRef = collection(db, "invaria");
  const q = query(usersCollectionRef, where("address", "==", address));
  // const q = query(usersCollectionRef, where("address", "==", "0x252CB346c174ad1471532CDCAF3A74229E9d2d6F"));
  //0xd33f4E98D16318e47dcC381345B4B408E02b6a92 //0xA450cC0A298d99C2794b2F26b9f8e4302a8fE5e1
  //0x252CB346c174ad1471532CDCAF3A74229E9d2d6F

  // console.log("q", q)
  const querySnapshota = await getDocs(q);
  let state = "Unverified";
  let data = null;
  querySnapshota.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log("doc", doc.data(), doc.data().audit_status);

    if (doc.data().audit_status !== undefined) {
      // console.log("state un ", state, doc.data().state)
      // console.log(doc.data().audit_status, doc.data().reject_reasons)
      // console.log((doc.data().audit_status).replace(/^:\w+\/\w+;base64,/))

      if (doc.data().audit_status == "Accepted") {
        state = "Accepted";
        data = {
          selectCountryRegion: doc.data().selectCountryRegion,
          inputName: doc.data().inputName,
          selectIDtype: doc.data().selectIDtype,
          inputIDnumber: doc.data().inputIDnumber,
          selectDate: doc.data().selectDate,
          inputEmail: doc.data().inputEmail,
          inputAddress: doc.data().inputAddress,
        };
        // console.log("state ac ", state)
      } else if (
        state !== "Accepted" &&
        doc.data().audit_status == "Rejected"
      ) {
        state = "Rejected";
        data = doc.data();
        // console.log("state rej ", state)
      } else if (
        doc.data().audit_status == "Pending" &&
        doc.data().reject_reasons.length == 0
      ) {
        state = "Pending";
        data = doc.data();
        // console.log("state pend", state)
      }
    }
  });
  // console.log("re", state, data)
  // console.log("sre", encryptData(data))

  return encryptData(data);
};

export const getUserByid = async (id) => {
  console.log("getuserByid");
  const usersCollectionRef = collection(db, "invaria");
  const q = query(usersCollectionRef, where("idv_task_id", "==", Number(id)));
  // const q = query(usersCollectionRef, where("address", "==", "0x252CB346c174ad1471532CDCAF3A74229E9d2d6F"));

  console.log("q", id.toString(), q);
  const querySnapshota = await getDocs(q);
  let state;
  let realState, realResult;
  let stateCode = 404;
  querySnapshota.forEach((doc) => {
    state = doc.data();
    // console.log("re", state,doc.data())
  });
  // console.log("re", state)
  return state;
};

// export const storeFirebase = ({user, data}) => {
//   const [newName, setNewName] = useState("");
//   const [newAge, setNewAge] = useState(0);

//   const updateUser = async (id, age) => {
//     const userDoc = doc(db, "users", id);
//     const newFields = { age: age + 1 };
//     await updateDoc(userDoc, newFields);
//   };

//   const deleteUser = async (id) => {
//     const userDoc = doc(db, "users", id);
//     await deleteDoc(userDoc);
//   };

//   // if (docSnap.exists()) {   !!!!!!!
