import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAunUHobKwdTn7_5z0sjLlv98LoPm2-Nnw",
  authDomain: "avon-oriflame-shops.firebaseapp.com",
  projectId: "avon-oriflame-shops",
  storageBucket: "avon-oriflame-shops.appspot.com",
  messagingSenderId: "1087017989196",
  appId: "1:1087017989196:web:79c0c3c20cf69f47bc70e9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const loginForm = document.getElementById("loginForm");
const loginContainer = document.getElementById("loginFormContainer");
const addProductForm = document.getElementById("addProductForm");
const preview = document.getElementById("preview");
const productImageInput = document.getElementById("productImage");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  if(username === "admin" && password === "admin123"){
    loginContainer.style.display = "none";
    addProductForm.style.display = "block";
  } else {
    alert("Невірний логін або пароль!");
  }
});

productImageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  preview.src = file ? URL.createObjectURL(file) : "";
});

addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("productName").value.trim();
  const brand = document.getElementById("productBrand").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const description = document.getElementById("productDescription").value.trim();
  const file = productImageInput.files[0];

  if (!name || !brand || isNaN(price) || !description || !file) {
    alert("Будь ласка, заповніть усі поля.");
    return;
  }

  const submitBtn = addProductForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "Завантаження...";

  try {
    const filename = `products/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const storageRef = ref(storage, filename);
    const uploadResult = await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(uploadResult.ref);

    await addDoc(collection(db, "products"), {
      name, brand, price, description, imageUrl, createdAt: serverTimestamp()
    });

    alert("Товар успішно додано!");
    addProductForm.reset();
    preview.src = "";
  } catch (error) {
    alert("Помилка при додаванні товару: " + error.message);
    console.error(error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Додати товар";
  }
});
