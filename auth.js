function toast(msg) {
    const notification = document.createElement("div");
    notification.innerText = msg;
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.background = "#111";
    notification.style.color = "white";
    notification.style.padding = "12px 18px";
    notification.style.border = "1px solid rgba(255,255,255,.1)";
    notification.style.borderRadius = "10px";
    notification.style.zIndex = "9999";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}
const user = {
    name,
    email,
    password,
    joinDate: new Date().getFullYear(),
    favoriteCategory: "BBQ",
    savedCount: 0
};

let users =
JSON.parse(localStorage.getItem("users")) || [];

users.push(user);

localStorage.setItem(
    "users",
    JSON.stringify(users)
);

localStorage.setItem(
    "currentUser",
    JSON.stringify(user)
);
function signup() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("pass").value.trim();

    if (!name || !email || !pass) {
        return toast("Complete all fields");
    }

    if (pass.length < 6) {
        return toast("Password must be at least 6 characters");
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.email === email)) {
        return toast("User already exists");
    }

    users.push({ name, email, pass });
    localStorage.setItem("users", JSON.stringify(users));
    toast("Account created");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}

function login() {
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("pass").value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.pass === pass);

    if (!user) {
        return toast("Invalid credentials");
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    toast("Welcome " + user.name);

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
}
if(user){

authArea.innerHTML = `
<li class="nav-item">
    <a class="nav-link" href="profile.html">
        Profile
    </a>
</li>
`;

}