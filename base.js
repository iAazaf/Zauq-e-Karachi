document.addEventListener("DOMContentLoaded", function () {
    const newsletterForm = document.getElementById("newsletterForm");
    if (!newsletterForm) return;

    newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("subscriberEmail").value.trim();
        if (!email) return;

        const subscribers = JSON.parse(localStorage.getItem("subscribers")) || [];
        if (subscribers.includes(email)) {
            Swal.fire({
                icon: "info",
                title: "Already subscribed",
                text: "This email is already registered.",
                confirmButtonText: "OK",
                confirmButtonColor: "#d4a762"
            });
            newsletterForm.reset();
            return;
        }

        subscribers.push(email);
        localStorage.setItem("subscribers", JSON.stringify(subscribers));

        Swal.fire({
            icon: "success",
            title: "Subscription successful",
            text: "You have been added to the mailing list.",
            confirmButtonText: "OK",
            confirmButtonColor: "#d4a762"
        });

        newsletterForm.reset();
    });

    const topBtn = document.getElementById("backToTop");
    if (topBtn) {
        topBtn.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});

$(window).scroll(function () {
    $(".custom-navbar").toggleClass("scrolled", $(window).scrollTop() > 50);
});

$(window).on("scroll", function () {
    $(".reveal").each(function () {
        const top = $(this).offset().top;
        const win = $(window).scrollTop();
        const height = $(window).height();

        if (win > top - height + 100) {
            $(this).addClass("active");
        }
    });
});

$(window).trigger("scroll");

const exploreBtn = document.getElementById("exploreBtn");
if (exploreBtn) {
    exploreBtn.addEventListener("click", function () {
        const section = document.getElementById("featuredRestaurants");
        if (section) {
            section.scrollIntoView({
                behavior: "smooth"
            });
        } else {
            window.location.href = "restaurants.html";
        }
    });
}
