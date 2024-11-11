document.getElementById("btn_register").addEventListener("click", register);
document.getElementById("btn_login").addEventListener("click", iniciar);

window.addEventListener("resize", widthpage);

//Variables
var cont_login_register = document.querySelector(".login_register");
var form_login = document.querySelector(".login");
var form_register = document.querySelector(".register");
var box_back_login = document.querySelector(".backbox_login");
var box_back_register = document.querySelector(".backbox_register");

function widthpage() {
    if (window.innerWidth > 850) {
        box_back_register.style.display = "block";
        box_back_login.style.display = "block";
    } else {
        box_back_register.style.display = "block";
        box_back_register.style.opacity = "1";
        box_back_login.style.display = "none";
        form_login.style.display = "block";
        form_register.style.display = "none";
        cont_login_register.style.left = "0px";
    }
}

widthpage();

function iniciar() {
    if (window.innerWidth > 850) {
        form_register.style.display = "none";
        cont_login_register.style.left = "10px";
        form_login.style.display = "block";
        box_back_register.style.opacity = "1";
        box_back_login.style.opacity = "0";
    } else {
        form_register.style.display = "none";
        cont_login_register.style.left = "0px";
        form_login.style.display = "block";
        box_back_register.style.display = "block";
        box_back_login.style.display = "none";
    }
}

function register() {
    if (window.innerWidth > 850) {
        form_register.style.display = "block";
        cont_login_register.style.left = "410px";
        form_login.style.display = "none";
        box_back_register.style.opacity = "0";
        box_back_login.style.opacity = "1";
    } else {
        form_register.style.display = "block";
        cont_login_register.style.left = "0px";
        form_login.style.display = "none";
        box_back_register.style.display = "none";
        box_back_login.style.display = "block";
        box_back_login.style.opacity = "1";
    }
}