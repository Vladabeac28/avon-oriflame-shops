// Імпортуй Firebase SDK у html перед admin.js:
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>

// Конфігурація Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAunUHobKwdTn7_5z0sjLlv98LoPm2-Nnw",
  authDomain: "avon-oriflame-shops.firebaseapp.com",
  projectId: "avon-oriflame-shops",
  storageBucket: "avon-oriflame-shops.appspot.com",
  messagingSenderId: "1087017989196",
  appId: "1:1087017989196:web:79c0c3c20cf69f47bc70e9",
  measurementId: "G-84FWM08GCK"
};

// Ініціалізація Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();

document.getElementById("addProductForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("productName").value;
    let brand = document.getElementById("productBrand").value;
    let price = parseFloat(document.getElementById("productPrice").value);
    let description = document.getElementById("productDescription").value;
    let file = document.getElementById("productImage").files[0];

    if (!file) {
        alert("Будь ласка, оберіть фото товару!");
        return;
    }

    // Створюємо унікальне ім'я файлу
    const timestamp = Date.now();
    const fileName = `products_images/${timestamp}_${file.name}`;

    // Завантаження фото в Storage
    const storageRef = storage.ref().child(fileName);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
        (snapshot) => {
            // можна додати прогрес завантаження
        }, 
        (error) => {
            console.error("Помилка завантаження:", error);
            alert("❌ Не вдалося завантажити фото!");
        }, 
        () => {
            // Завантаження завершено
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                // Додаємо новий документ у Firestore
                db.collection("products").add({
                    name: name,
                    brand: brand,
                    price: price,
                    description: description,
                    image: downloadURL, // посилання на фото
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    alert("✅ Товар додано у Firestore!");
                    document.getElementById("addProductForm").reset();
                }).catch((error) => {
                    console.error("Помилка додавання товару у Firestore:", error);
                    alert("❌ Не вдалося додати товар!");
                });
            });
        }
    );
});

