const user =
    JSON.parse(
        localStorage.getItem("currentUser")
    );

if(!user){

    window.location.href = "login.html";

}

document.getElementById("profileName").textContent =
    user.name;

document.getElementById("profileEmail").textContent =
    user.email;

document.getElementById("joinDate").textContent =
    user.joinDate || "2026";

document.getElementById("favoriteCategory").textContent =
    user.favoriteCategory || "BBQ";

document.getElementById("savedCount").textContent =
    user.savedCount || 0;


document
.getElementById("logoutBtn")
.addEventListener("click", () => {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";

});