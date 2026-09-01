import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'ai-studio-archora-92a3eed3-6dc7-4b9c-8eb9-25611af07c42'
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const docRef = doc(db, 'settings', 'frontendConfig');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    console.log(JSON.stringify(snap.data().menuItems, null, 2));
  } else {
    console.log("No doc");
  }
}
run();
