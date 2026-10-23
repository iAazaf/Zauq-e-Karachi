function renderNavbar() {
    const authArea =
        document.getElementById("authArea");
    if (!authArea) return;
    const user =
        JSON.parse(
            localStorage.getItem("currentUser")
        );
    if (user) {
        authArea.innerHTML = `
            <li class="nav-item user-box">
                <a class="nav-link auth-btn">
                    ${user.name.split(" ")[0]}
                </a>
                <div class="user-menu">
                    <a href="profile.html">
                        Profile
                    </a>
                    <a href="#" id="logoutBtn">
                        Logout
                    </a>
                </div>

            </li>
        `;

        document
            .getElementById("logoutBtn")
            .addEventListener("click", function(e){

                e.preventDefault();

                localStorage.removeItem(
                    "currentUser"
                );
                window.location.href =
                    "login.html";
            });
    }
    else {
        authArea.innerHTML = `
            <li class="nav-item">
                <a
                    class="nav-link auth-btn"
                    href="login.html">
                    Login
                </a>

            </li>
        `;
    }
}
renderNavbar();