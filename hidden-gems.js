let gems = [];
let filteredGems = [];
let currentPage = 1;
const itemsPerPage = 6;
const container = document.getElementById("gemContainer");
const gemCount = document.getElementById("gemCount");
const pagination = document.getElementById("pagination");

// 1. Optimized Skeleton Loader (FIXED: Added responsive col-12 for mobile)
function showSkeleton() {
    container.innerHTML = "";
    let skeletonHTML = "";
    for (let i = 0; i < itemsPerPage; i++) {
        skeletonHTML += `
        <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                    <div class="skeleton-line"></div>
                </div>
            </div>
        </div>`;
    }
    container.innerHTML = skeletonHTML;
}

// 2. Fetch Data initially
fetch("hidden-gems.json")
    .then((res) => res.json())
    .then((data) => {
        gems = data;
        filteredGems = data;
        gemCount.innerText = `${gems.length} Hidden Gems Found`;
        renderGems(); 
    })
    .catch((err) => {
        console.error("Error loading gems:", err);
    });

// 3. Category Filter Buttons (Click Event)
$(document).on("click", ".filter-btn", function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    currentPage = 1;
    applyFilters(); 
});

// 4. Search Input Event
$("#searchInput").on("keyup", function () {
    currentPage = 1;
    applyFilters();
});

// 5. Area Dropdown Selector Event
$("#areaFilter").on("change", function () {
    currentPage = 1;
    applyFilters();
});

// 6. Centralized Filter Function
function applyFilters() {
    const searchValue = $("#searchInput").val().toLowerCase();
    const activeCategory = $(".filter-btn.active").data("filter");
    const selectedArea = $("#areaFilter").val() || "all";

    filteredGems = gems.filter((item) => {
        const matchCategory = !activeCategory || activeCategory === "all" || item.category.toLowerCase() === activeCategory.toLowerCase();
        const matchSearch = item.name.toLowerCase().includes(searchValue) || (item.desc && item.desc.toLowerCase().includes(searchValue));
        const matchArea = selectedArea === "all" || (item.area && item.area.toLowerCase().includes(selectedArea.toLowerCase()));
        
        return matchCategory && matchSearch && matchArea;
    });

    gemCount.innerText = `${filteredGems.length} Hidden Gems Found`;
    renderGems();
}

// 7. Render dynamic Cards (FIXED: Responsive layouts + Map query strings corrected)
function renderGems() {
    showSkeleton();
    
    setTimeout(() => {
        container.innerHTML = "";
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginated = filteredGems.slice(start, end);

        if (paginated.length === 0) {
            container.innerHTML = `
            <div class="col-12 no-results text-center py-5">
                <i class="fa-solid fa-utensils fa-3x mb-3 text-warning"></i>
                <h3>No hidden gems found</h3>
                <p>Try a different search, category or area</p>
            </div>`;
            pagination.innerHTML = "";
            return;
        }

        let cardsHTML = "";
        paginated.forEach((item) => {
            // Standard dynamic string formatting map routing setup
            const mapQuery = encodeURIComponent(`${item.name} ${item.area} Karachi`);
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

           cardsHTML += `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="hidden-gem-card">
                    <span class="gem-badge">${item.category || 'Hidden Gem'}</span>
                    <img src="${item.image}" alt="${item.name}">
                    
                    <div class="gem-content d-flex flex-column">
                        <h3>${item.name}</h3>
                        <p class="gem-area">
                            <i class="fa-solid fa-location-dot me-1"></i>
                            ${item.area}
                        </p>
                        <p class="gem-desc">${item.desc}</p>
                        
                        <div class="must-try mb-3">
                            <strong>Must Try:</strong> ${item.mustTry || item.mustOrder}
                        </div>
                        
                        <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-maps w-100 mt-auto">
                            <i class="fa-solid fa-map-location-dot"></i> View on Google Maps
                        </a>
                    </div>
                </div>
            </div>`;
        });
        
        container.innerHTML = cardsHTML;
        renderPagination();
    }, 400);
}

// 8. Render Pagination Buttons smoothly
function renderPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(filteredGems.length / itemsPerPage);
    
    let paginationHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
        <li class="page-item ${i === currentPage ? "active" : ""}">
            <a class="page-link" href="#" onclick="goToPage(event, ${i})">${i}</a>
        </li>`;
    }
    pagination.innerHTML = paginationHTML;
}

// 9. Change Page function
function goToPage(event, page) {
    event.preventDefault(); 
    currentPage = page;
    renderGems();
    
    // Smooth scroll back to top of section
    const targetSection = document.getElementById("searchInput");
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}