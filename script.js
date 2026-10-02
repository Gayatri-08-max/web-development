document.querySelector("#contactForm").onsubmit = function(event) {
    event.preventDefault();

    let name = document.querySelector("#name").value;
    let email = document.querySelector("#email").value;
    let message = document.querySelector("#messageInput").value;
    let formMessage = document.querySelector("#formMessage");

    if (name === "" || email === "" || message === "") {
        formMessage.textContent = "Please fill in all fields.";
        formMessage.style.color = "red";
        return;
    }

    if (!email.includes("@")) {
        formMessage.textContent = "Please enter a valid email address.";
        formMessage.style.color = "red";
        return;
    }
    if (message.length < 10) {
        formMessage.textContent = "Message must be at least 10 characters.";
        formMessage.style.color = "red";
        return;
    }
    let button = document.querySelector("#contactForm button");
    button.textContent = "Sent!";
    button.disabled=true;

    formMessage.textContent = "Message submitted successfully!";
    formMessage.style.color = "green";

    document.querySelector("#contactForm").reset();
    setTimeout(function() {
        button.textContent = "Send Message";
        formMessage.textContent = "";
    }, 2000);
};


document.querySelector("#changeTitle").onclick = function() {
    document.querySelector("h1").textContent = "Welcome to My Portfolio!";
};

document.querySelector("#toggleGoals").onclick = function() {
    let goalsText = document.querySelector("#goalsText");

    goalsText.hidden = !goalsText.hidden;

    if (goalsText.hidden) {
        this.textContent = "Show Goals";
    } else {
        this.textContent = "Hide Goals";
    }
};

document.querySelector("#showSkills").onclick = function() {
    let skillsList = document.querySelector("#skillsList");

    skillsList.hidden = !skillsList.hidden;

    if (skillsList.hidden) {
        this.textContent = "Show My Skills";
    } else {
        this.textContent = "Hide My Skills";
    }
};