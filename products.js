let laptops = []

const productsGrid = document.getElementById('products-grid')
const brandFilter = document.getElementById('brand-filter')
const ramFilter = document.getElementById('ram-filter')
const processorFilter = document.getElementById('processor-filter')
const priceFilter = document.getElementById('price-filter')
const priceValue = document.getElementById('price-value')
const searchInput = document.getElementById('search-input')

function renderLaptops(list) {
  productsGrid.innerHTML = ''
  if (list.length === 0) {
    productsGrid.innerHTML = '<div class="no-results">No laptops found.</div>'
    return
  }
  list.forEach(laptop => {
    const card = document.createElement('div')
    card.className = 'laptop-card fade-in'
    card.innerHTML = `
      <div class="laptop-image">
        <img src="https://via.placeholder.com/300x200?text=${laptop.brand}+${laptop.model}" alt="${laptop.brand} ${laptop.model}" loading="lazy">
      </div>
      <div class="laptop-info">
        <h3>${laptop.brand} <span>${laptop.model}</span></h3>
        <p><strong>Processor:</strong> ${laptop.processor}</p>
        <p><strong>RAM:</strong> ${laptop.ram} &nbsp; <strong>Storage:</strong> ${laptop.storage}</p>
        ${laptop.gpu ? `<p><strong>GPU:</strong> ${laptop.gpu}</p>` : ''}
        <div class="laptop-price">₹${laptop.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
        <button class="btn btn-primary view-details-btn" data-id="${laptop.laptopId}">View Details</button>
      </div>
    `
    productsGrid.appendChild(card)
  })
  setTimeout(() => {
    document.querySelectorAll('.laptop-card').forEach(el => el.classList.add('visible'))
  }, 100)
}

function filterLaptops() {
  let filtered = laptops.slice()
  if (brandFilter.value) filtered = filtered.filter(l => l.brand === brandFilter.value)
  if (ramFilter.value) filtered = filtered.filter(l => l.ram === ramFilter.value)
  if (processorFilter.value) filtered = filtered.filter(l => l.processor.includes(processorFilter.value))
  if (priceFilter.value) filtered = filtered.filter(l => l.price <= parseInt(priceFilter.value))
  if (searchInput.value) {
    const q = searchInput.value.toLowerCase()
    filtered = filtered.filter(l => l.brand.toLowerCase().includes(q) || l.model.toLowerCase().includes(q))
  }
  renderLaptops(filtered)
}

// Event listeners
brandFilter.addEventListener('change', filterLaptops)
ramFilter.addEventListener('change', filterLaptops)
processorFilter.addEventListener('change', filterLaptops)
priceFilter.addEventListener('input', () => {
  priceValue.textContent = `Up to ₹${parseInt(priceFilter.value).toLocaleString('en-IN')}`
  filterLaptops()
})
searchInput.addEventListener('input', filterLaptops)

productsGrid.addEventListener('click', (e) => {
  if (e.target.classList.contains('view-details-btn')) {
    const id = e.target.getAttribute('data-id')
    window.location.href = `product-detail.html?laptopId=${id}`
  }
})

// Fetch from backend on page load
priceFilter.value = 200000
priceValue.textContent = `Up to ₹${parseInt(priceFilter.value).toLocaleString('en-IN')}`

fetch('http://localhost:9090/laptop-db/getAll')
  .then(res => res.json())
  .then(data => {
    laptops = data
    filterLaptops()
  })
  .catch(err => {
    console.error('Failed to load laptops:', err)
    productsGrid.innerHTML = '<div class="no-results">Failed to fetch laptops.</div>'
  })
