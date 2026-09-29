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

    formMessage.textContent = "Message submitted successfully!";
    formMessage.style.color = "green";

    document.querySelector("#contactForm").reset();
    setTimeout(function() {
        button.textContent = "Send Message";
    }, 2000);
};