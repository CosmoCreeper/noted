const home = document.getElementById("home");
const spinner = document.getElementById("spinner");
const spinnerCheck = document.getElementById("spinner-checkbox");
const captcha = document.getElementById("captcha");

const checkInput = (e) => {
    if (e.key === "Enter") {
        if (e.target.value === "8130") {
            home.classList.toggle("hidden");
            spinner.classList.toggle("hidden");
            spinnerCheck.classList.toggle("hidden");
            setTimeout(() => {
                spinnerCheck.checked = !spinnerCheck.checked;
            }, 1000);
            setTimeout(() => {
                captcha.classList.toggle("hidden");
                spinner.classList.toggle("hidden");
                spinnerCheck.classList.toggle("hidden");
            }, 2000);
        }
    }
}