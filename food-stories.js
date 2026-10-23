const stories = [
    {
        id: "burns-road",
        title: "Burns Road: The Heart of Karachi Food",
        tag: "History",
        image: "images/burns-road.jpeg",
        desc: "The legendary historic street that shaped Karachi's local late-night culinary landscape.",
        modalText: "Burns Road stands as the oldest food street in Karachi, established post-partition. It is famous for traditional dishes like Waheed Kebab's Fry Kabab, Delhi Rabri House, and perfectly spiced authentic nihari that keeps the street buzzing until dawn."
    },
    {
        id: "nihari",
        title: "Why Nihari Became A Breakfast Icon",
        tag: "Tradition",
        image: "images/nihari-story.jpeg",
        desc: "A slow-cooked dynamic gravy legacy passed down lovingly through multiple generations.",
        modalText: "Originally a royal breakfast dish during the Mughal era, Nihari found a permanent home in Karachi. Cooked overnight for over 6-8 hours, the tender meat gravy served with hot khameeri rotis is now the city's ultimate weekend comfort breakfast."
    },
    {
        id: "chai",
        title: "Chai Hotels And Karachi Nights",
        tag: "Culture",
        image: "images/chai-story.jpeg",
        desc: "The sprawling city never sleeps and neither do its vibrant outdoor dhaba chai spots.",
        modalText: "Quetta dhabas and open-air cafés across Karachi act as social hubs. From Karak Chai to Doodh Patti paired with flaky parathas, these roadside spots hold deep political, creative, and casual conversations across all classes every night."
    },
    {
        id: "bun-kebab",
        title: "The Rise Of Bun Kebab",
        tag: "Street Food",
        image: "images/bun-kebab.jpeg",
        desc: "A pocket-friendly fast meal option that proudly became a timeless iconic city classic.",
        modalText: "Long before international burger chains arrived, Karachi invented the Bun Kebab. Featuring a signature daal and egg patty, spicy green chutney, and onions toasted on a giant tawa, it remains the ultimate budget street snack."
    },
    {
        id: "boat-basin",
        title: "Boat Basin Food Evolution",
        tag: "Modern Karachi",
        image: "images/boat-basin.jpeg",
        desc: "How Boat Basin dynamically transformed over decades into an elite coastal food oasis.",
        modalText: "Boat Basin in Clifton evolved from a quiet strip to a massive 24/7 food strip. Perfectly merging fast food with traditional open-air handis, it catering smoothly to late-night beach travelers and upscale city food explorers."
    },
    {
        id: "bbq",
        title: "Karachi's Undying Love For BBQ",
        tag: "Food Culture",
        image: "images/bbq-story.jpeg",
        desc: "The history and passion behind smoky charcoal tikka and creamy malai boti nights.",
        modalText: "Karachi's charcoal game is legendary. From soft, melt-in-the-mouth Malai Boti to fiery seekh kebabs and spicy tikkas, the smoke rising from restaurant rows at nights defines the fragrant aroma of Karachi's active streets."
    }
];

// Load Cards into DOM
const container = document.getElementById("storiesContainer");

stories.forEach(story => {
    container.innerHTML += `
        <div class="col-lg-4 col-md-6">
            <div class="story-card">
                <img src="${story.image}" alt="${story.title}">
                <div class="story-content">
                    <span class="story-tag">${story.tag}</span>
                    <h3>${story.title}</h3>
                    <p>${story.desc}</p>
                    <button class="primary-btn read-btn read-story-btn" data-story="${story.id}">
                        Read Story
                    </button>
                </div>
            </div>
        </div>
    `;
});

// Modal Popups for Both Featured & Grid Buttons via Event Delegation
document.addEventListener("click", function(e) {
    if (e.target && e.target.classList.contains("read-story-btn")) {
        const storyId = e.target.getAttribute("data-story");
        
        if (storyId === "biryani") {
            Swal.fire({
                title: "The King: Karachi Biryani",
                text: "Karachi biryani is different because of its layering style (Teh wali biryani) and sharp potato integration. Brought over during migration, it evolved into a vibrant spicy mix of aromatic basmati rice, prunes (aloo bokhary), and tender meat that anchors every celebratory milestone in the city.",
                icon: "info",
                confirmButtonColor: "#d4a762",
                background: "#111",
                color: "#fff"
            });
        } else {
            const selectedStory = stories.find(s => s.id === storyId);
            if (selectedStory) {
                Swal.fire({
                    title: selectedStory.title,
                    text: selectedStory.modalText,
                    icon: "info",
                    confirmButtonColor: "#d4a762",
                    background: "#111",
                    color: "#fff"
                });
            }
        }
    }
});