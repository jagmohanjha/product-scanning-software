// ================= GET ELEMENTS =================

const productImage =
    document.getElementById("productImage");

const previewImage =
    document.getElementById("previewImage");

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

    // Check file type
    if (!file.type.startsWith("image/")) {

        alert("Please select an image file.");

        this.value = "";

        return;
    }

    // Create image preview
    const imageURL =
        URL.createObjectURL(file);

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

    // Clear OCR result
    if (ocrResult) {
        ocrResult.classList.remove("show");
    }

    if (ocrStatus) {
        ocrStatus.textContent =
            "🔄 Waiting for analysis...";
    }

    if (extractedText) {
        extractedText.textContent = "";
    }

});


// ================= ANALYZE / OCR =================

analyzeBtn.addEventListener(
    "click",
    async function () {

        // Check image
        if (!productImage.files.length) {

            alert(
                "Please upload a product image first."
            );

            return;
        }


        // Check Tesseract
        if (typeof Tesseract === "undefined") {

            alert(
                "Tesseract.js is not loaded.\n\n" +
                "Please check your scan.html file."
            );

            return;
        }


        const file =
            productImage.files[0];


        // Show OCR result section
        if (ocrResult) {
            ocrResult.classList.add("show");
        }

        if (ocrStatus) {
            ocrStatus.textContent =
                "🔄 Preparing image...";
        }

        if (extractedText) {
            extractedText.textContent = "";
        }


        // Disable button
        analyzeBtn.disabled = true;

        const originalButtonText =
            analyzeBtn.textContent;

        analyzeBtn.textContent =
            "Preparing...";


        try {

            // ================= CREATE IMAGE =================

            const image =
                new Image();

            const imageURL =
                URL.createObjectURL(file);

            image.src = imageURL;


            // Wait for image to load
            await new Promise(
                (resolve, reject) => {

                    image.onload = resolve;

                    image.onerror = reject;

                }
            );


            // ================= CREATE CANVAS =================

            const canvas =
                document.createElement("canvas");

            const ctx =
                canvas.getContext("2d");


            // Increase image size
            const scale = 2;

            canvas.width =
                image.width * scale;

            canvas.height =
                image.height * scale;


            // ================= DRAW IMAGE =================

            ctx.drawImage(
                image,
                0,
                0,
                canvas.width,
                canvas.height
            );


            // ================= GRAYSCALE =================

            analyzeBtn.textContent =
                "Processing Image...";

            if (ocrStatus) {
                ocrStatus.textContent =
                    "⚙️ Improving image quality...";
            }


            const imageData =
                ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

            const data =
                imageData.data;


            for (
                let i = 0;
                i < data.length;
                i += 4
            ) {

                const red =
                    data[i];

                const green =
                    data[i + 1];

                const blue =
                    data[i + 2];


                const gray =
                    0.299 * red +
                    0.587 * green +
                    0.114 * blue;


                data[i] =
                    gray;

                data[i + 1] =
                    gray;

                data[i + 2] =
                    gray;

            }


            ctx.putImageData(
                imageData,
                0,
                0
            );


            // ================= OCR =================

            analyzeBtn.textContent =
                "Reading Label...";

            if (ocrStatus) {
                ocrStatus.textContent =
                    "🔍 Reading product label...";
            }


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


                                analyzeBtn.textContent =
                                    `Reading ${progress}%`;


                                if (ocrStatus) {

                                    ocrStatus.textContent =
                                        `🔍 Reading label... ${progress}%`;

                                }

                            }

                        }

                    }
                );


            // ================= GET OCR TEXT =================

            const text =
                result.data.text.trim();


            // ================= SHOW RESULT =================

            if (!text) {

                if (ocrStatus) {

                    ocrStatus.textContent =
                        "⚠️ Could not detect readable text.";

                }


                if (extractedText) {

                    extractedText.textContent =
                        "No readable text found. Please try a clearer product image.";

                }

            }

            else {

                if (ocrStatus) {

                    ocrStatus.textContent =
                        "✅ Text extracted successfully.";

                }


                if (extractedText) {

                    extractedText.textContent =
                        text;

                }


                // Console result
                console.log(
                    "========== OCR RESULT =========="
                );

                console.log(text);

                console.log(
                    "================================"
                );

            }


            // Remove temporary URL
            URL.revokeObjectURL(imageURL);

        }


        catch (error) {

            console.error(
                "OCR Error:",
                error
            );


            if (ocrStatus) {

                ocrStatus.textContent =
                    "❌ OCR failed.";

            }


            if (extractedText) {

                extractedText.textContent =
                    "OCR failed. Please try another image.";

            }

        }


        finally {

            analyzeBtn.disabled = false;

            analyzeBtn.textContent =
                originalButtonText;

        }

    }
);