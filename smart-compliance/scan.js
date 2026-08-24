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

const ocrResult =
    document.getElementById("ocrResult");

const ocrStatus =
    document.getElementById("ocrStatus");

const extractedText =
    document.getElementById("extractedText");


// ================= IMAGE SELECT =================

productImage.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {

        alert("Please select an image file.");

        this.value = "";

        return;
    }

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


// ================= OCR =================

analyzeBtn.addEventListener("click", async function () {

    if (!productImage.files.length) {

        alert("Please upload a product image first.");

        return;
    }

    const file = productImage.files[0];

    ocrResult.classList.add("show");

    ocrStatus.textContent =
        "🔄 Preparing image...";

    extractedText.textContent = "";

    analyzeBtn.disabled = true;

    try {

        // 1. Create image object

        const image = new Image();

        image.src = URL.createObjectURL(file);

        await new Promise((resolve, reject) => {

            image.onload = resolve;

            image.onerror = reject;

        });


        // 2. Create canvas

        const canvas =
            document.createElement("canvas");

        const ctx =
            canvas.getContext("2d");


        // 3. Increase image size

        const scale = 2;

        canvas.width =
            image.width * scale;

        canvas.height =
            image.height * scale;


        // 4. Draw image

        ctx.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
        );


        // 5. Convert to grayscale

        const imageData =
            ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

        const data = imageData.data;


        for (let i = 0; i < data.length; i += 4) {

            const red = data[i];

            const green = data[i + 1];

            const blue = data[i + 2];


            const gray =
                0.299 * red +
                0.587 * green +
                0.114 * blue;


            data[i] = gray;

            data[i + 1] = gray;

            data[i + 2] = gray;
        }


        ctx.putImageData(imageData, 0, 0);


        // 6. OCR

        ocrStatus.textContent =
            "🔍 Reading product label...";


        const result =
            await Tesseract.recognize(
                canvas,
                "eng",
                {
                    logger: function (info) {

                        if (
                            info.status ===
                            "recognizing text"
                        ) {

                            const progress =
                                Math.round(
                                    info.progress * 100
                                );

                            ocrStatus.textContent =
                                `🔍 Reading label... ${progress}%`;
                        }

                    }
                }
            );


        // 7. Get text

        const text =
            result.data.text.trim();


        if (!text) {

            extractedText.textContent =
                "No readable text found.";

            ocrStatus.textContent =
                "⚠️ Could not detect readable text.";

        } else {

            extractedText.textContent =
                text;

            ocrStatus.textContent =
                "✅ Text extracted successfully.";
        }

    }

    catch (error) {

        console.error(error);

        ocrStatus.textContent =
            "❌ OCR failed. Please try another image.";

    }

    finally {

        analyzeBtn.disabled = false;

    }

});