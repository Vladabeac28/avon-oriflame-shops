document.getElementById("addProductForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("productName").value;
    let brand = document.getElementById("productBrand").value;
    let price = parseFloat(document.getElementById("productPrice").value);
    let description = document.getElementById("productDescription").value;
    let file = document.getElementById("productImage").files[0];

    let reader = new FileReader();
    reader.onloadend = function () {
        let imageData = reader.result; // зберігаємо фото як Base64

        let products = JSON.parse(localStorage.getItem("products")) || [];
        let newProduct = {
            id: Date.now(),
            name,
            brand,
            price,
            image: imageData,
            description
        };

        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));

        alert("✅ Товар додано!");
        document.getElementById("addProductForm").reset();
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});
