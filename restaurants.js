let restaurants = [];
let filteredRestaurants = [];
let currentFilter = "all";
let currentArea = "all";
let currentPage = 1;
const itemsPerPage = 6;
const container = document.getElementById("restaurantContainer");

fetch("restaurants.json")
  .then((res) => res.json())
  .then((data) => {
    restaurants = data;

    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");

    if (category) {
      currentFilter = category.toLowerCase(); // Consistent lowercase parsing
      $(".filter-btn").removeClass("active");
      $(`[data-filter="${category}"]`).addClass("active");
      
      filteredRestaurants = restaurants.filter(item =>
        item.category.toLowerCase() === currentFilter
      );
    } else {
      filteredRestaurants = data;
    }
    render();
  })
  .catch((err) => console.log("JSON Error:", err));

function render() {
  displayRestaurants();
  createPagination();
  updateCount();
}

function displayRestaurants() {
  container.innerHTML = "";
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredRestaurants.slice(start, end);

  if (pageItems.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fa-solid fa-utensils fa-4x mb-3 text-warning"></i>
        <h3>No Restaurant Found</h3>
        <p class="text-muted">Try another keyword or category.</p>
      </div>
    `;
    return;
  }

  pageItems.forEach((item) => {
    const mapQuery = encodeURIComponent(`${item.name} ${item.area} Karachi`);
    // FIXED: Corrected the standard interpolation syntax ${mapQuery}
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

    container.innerHTML += `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card restaurant-card h-100">
          <img src="${item.image}" class="card-img-top" alt="${item.name}">
          
          <div class="card-body d-flex flex-column">
            <div>
              <span class="badge category-card mb-2 text-uppercase">
                ${item.category}
              </span>
            </div>

            <h4 class="restaurant-name mt-2">${item.name}</h4>

            <p class="paragraph-1">
              <i class="fa-solid fa-location-dot"></i>
              ${item.area}
            </p>

            <p class="paragraph">${item.desc}</p>

            <p class="paragraph-must-try">
              <strong>Must Try:</strong> ${item.mustOrder}
            </p>

            <a
              href="${mapUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-maps mt-auto w-100">
              <i class="fa-solid fa-map-location-dot"></i>
              View on Google Maps
            </a>
          </div>
        </div>
      </div>
    `;
  });
}

function applyFilters() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  
  filteredRestaurants = restaurants.filter((item) => {
    // FIXED: Handled case sensitivity for exact matches
    const matchCategory = currentFilter === "all" || item.category.toLowerCase() === currentFilter.toLowerCase();
    const matchArea = currentArea === "all" || item.area.toLowerCase() === currentArea.toLowerCase();
    
    const matchSearch =
      item.name.toLowerCase().includes(searchValue) ||
      item.area.toLowerCase().includes(searchValue) ||
      item.category.toLowerCase().includes(searchValue) ||
      item.mustOrder.toLowerCase().includes(searchValue);
      
    return matchCategory && matchArea && matchSearch;
  });

  currentPage = 1;
  render();
}

function createPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <button class="page-number ${currentPage === i ? "active" : ""}" onclick="goToPage(${i})">
        ${i}
      </button>
    `;
  }
}

function goToPage(page) {
  currentPage = page;
  render();
  const targetSection = document.getElementById("restaurantContainer");
  if (targetSection) {
    const yOffset = -100;
    const y = targetSection.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

function updateCount() {
  document.getElementById("restaurantCount").innerHTML =
    `Showing <span style="color:var(--gold); font-weight:700;">${filteredRestaurants.length}</span> Restaurants`;
}

// Event Listeners
$(".filter-btn").click(function () {
  $(".filter-btn").removeClass("active");
  $(this).addClass("active");
  currentFilter = $(this).data("filter");
  applyFilters();
});

$("#areaFilter").change(function () {
  currentArea = $(this).val();
  applyFilters();
});

$("#searchInput").on("keyup", function(){
  applyFilters();
});