document.addEventListener("DOMContentLoaded", () => {

    // ================= YEAR =================
    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // ================= THEME =================
    const themeToggle = document.querySelector(".theme-toggle");
    const savedTheme =
        localStorage.getItem("smartcheck-theme") || "light";

    document.body.setAttribute("data-theme", savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }


    // ================= OCR ELEMENTS =================
    const productImage = document.getElementById("productImage");
    const previewImage = document.getElementById("previewImage");
    const previewContainer =
        document.getElementById("previewContainer");
    const fileName = document.getElementById("fileName");
    const removeBtn = document.getElementById("removeBtn");
    const analyzeBtn = document.getElementById("analyzeBtn");

    const ocrResult = document.getElementById("ocrResult");
    const ocrStatus = document.getElementById("ocrStatus");
    const extractedText =
        document.getElementById("extractedText");


    // If this is not the scan page, stop OCR code
    if (!productImage || !analyzeBtn) {
        return;
    }


    // ================= IMAGE SELECT =================

    productImage.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        // Check image type
        if (!file.type.startsWith("image/")) {

            alert("Please select an image file.");

            this.value = "";

            return;
        }


        // Create preview
        const imageURL = URL.createObjectURL(file);

        if (previewImage) {
            previewImage.src = imageURL;
        }

        if (previewContainer) {
            previewContainer.classList.add("show");
        }

        if (fileName) {
            fileName.textContent =
                "Selected: " + file.name;
        }

        if (removeBtn) {
            removeBtn.classList.add("show");
        }

        analyzeBtn.disabled = false;
    });


    // ================= REMOVE IMAGE =================

    if (removeBtn) {

        removeBtn.addEventListener("click", function () {

            productImage.value = "";

            if (previewImage) {
                previewImage.src = "";
            }

            if (previewContainer) {
                previewContainer.classList.remove("show");
            }

            if (fileName) {
                fileName.textContent = "";
            }

            removeBtn.classList.remove("show");

            analyzeBtn.disabled = true;
        });
    }


    // ================= OCR ANALYSIS =================

    analyzeBtn.addEventListener("click", async function () {

        if (!productImage.files.length) {

            alert("Please upload a product image first.");

            return;
        }


        // Check Tesseract
        if (typeof Tesseract === "undefined") {

            alert(
                "Tesseract.js is not loaded. Please check the Tesseract CDN in your HTML."
            );

            return;
        }


        const file = productImage.files[0];

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

        analyzeBtn.disabled = true;


        try {

            // ================= CREATE IMAGE =================

            const image = new Image();

            image.src = URL.createObjectURL(file);


            await new Promise((resolve, reject) => {

                image.onload = resolve;

                image.onerror = reject;

            });


            // ================= CREATE CANVAS =================

            const canvas = document.createElement("canvas");

            const ctx = canvas.getContext("2d");


            // Increase image size
            const scale = 2;

            canvas.width = image.width * scale;

            canvas.height = image.height * scale;


            // ================= DRAW IMAGE =================

            ctx.drawImage(
                image,
                0,
                0,
                canvas.width,
                canvas.height
            );


            // ================= GRAYSCALE =================

            const imageData = ctx.getImageData(
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


            // ================= OCR =================

            if (ocrStatus) {
                ocrStatus.textContent =
                    "🔍 Reading product label...";
            }


            const result = await Tesseract.recognize(
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


                            if (ocrStatus) {

                                ocrStatus.textContent =
                                    `🔍 Reading label... ${progress}%`;

                            }
                        }
                    }
                }
            );


            // ================= GET TEXT =================

            const text =
                result.data.text.trim();


            if (!text) {

                if (extractedText) {

                    extractedText.textContent =
                        "No readable text found.";

                }

                if (ocrStatus) {

                    ocrStatus.textContent =
                        "⚠️ Could not detect readable text.";

                }

            } else {

                if (extractedText) {

                    extractedText.textContent =
                        text;

                }

                if (ocrStatus) {

                    ocrStatus.textContent =
                        "✅ Text extracted successfully.";

                }
            }


            // Clean object URL
            URL.revokeObjectURL(image.src);

        }


        catch (error) {

            console.error(
                "OCR Error:",
                error
            );


            if (ocrStatus) {

                ocrStatus.textContent =
                    "❌ OCR failed. Please try another image.";

            }
        }


        finally {

            analyzeBtn.disabled = false;

        }

    });

});


// ================= THEME FUNCTION =================

function toggleTheme() {

    const currentTheme =
        document.body.getAttribute("data-theme") === "dark"
            ? "light"
            : "dark";


    document.body.setAttribute(
        "data-theme",
        currentTheme
    );


    localStorage.setItem(
        "smartcheck-theme",
        currentTheme
    );
}


// ================= START SCAN =================

function startScan() {

    window.location.href = "scan.html";

}


// ================= HOW IT WORKS =================

function scrollToHow() {

    const section =
        document.getElementById("how-it-works");

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}