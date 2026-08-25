document.addEventListener("DOMContentLoaded", () => {
    const yearElement = document.getElementById("year");
    const themeToggle = document.querySelector(".theme-toggle");
    const savedTheme = localStorage.getItem("smartcheck-theme") || "light";

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    document.body.setAttribute("data-theme", savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }
});

function toggleTheme() {
    const currentTheme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", currentTheme);
    localStorage.setItem("smartcheck-theme", currentTheme);
}

function startScan() {
    alert("Scan Product page will be connected here.");
}

function scrollToHow() {
    document
        .getElementById("how-it-works")
        .scrollIntoView({
            behavior: "smooth"
        });
}
