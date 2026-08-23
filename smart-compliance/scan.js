const productImage = document.getElementById("productImage");

const previewImage = document.getElementById("previewImage");

const previewContainer =
    document.getElementById("previewContainer");

const fileName =
    document.getElementById("fileName");

const removeBtn =
    document.getElementById("removeBtn");

const analyzeBtn =
    document.getElementById("analyzeBtn");


// ================= IMAGE SELECT =================

productImage.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }


    // Check file type

    if (!file.type.startsWith("image/")) {

        alert("Please select an image file.");

        this.value = "";

        return;
    }


    // Create image preview

    const imageURL = URL.createObjectURL(file);

    previewImage.src = imageURL;

    previewContainer.classList.add("show");

    fileName.textContent =
        "Selected: " + file.name;

    removeBtn.classList.add("show");

    analyzeBtn.disabled = false;

});


// ================= REMOVE IMAGE =================

removeBtn.addEventListener("click", function () {

    productImage.value = "";

    previewImage.src = "";

    previewContainer.classList.remove("show");

    fileName.textContent = "";

    removeBtn.classList.remove("show");

    analyzeBtn.disabled = true;

});


// ================= ANALYZE =================

analyzeBtn.addEventListener("click", function () {

    if (!productImage.files.length) {

        alert("Please upload a product image first.");

        return;
    }


    alert(
        "Image uploaded successfully!\n\n" +
        "OCR and compliance analysis not connected so you can not analyze image "
    );

});