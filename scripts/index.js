const apiUrl = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('searchType')) {
        document.getElementById('searchType').addEventListener('change', handleSearchTypeChange);
    }

    if (document.getElementById('productDetails')) {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        fetchProductDetails(productId);
    }
});

function handleSearchTypeChange() {
    const searchType = document.getElementById('searchType').value;
    const categoryDropdown = document.getElementById('categoryDropdown');
    const productsList = document.getElementById('productsList');
    
    if (searchType === 'category') {
        fetchCategories();
        categoryDropdown.style.display = 'block';
        productsList.innerHTML = '';
    } else if (searchType === 'all') {
        categoryDropdown.style.display = 'none';
        fetchAllProducts();
    } else {
        categoryDropdown.style.display = 'none';
        productsList.innerHTML = '';
    }
}

function fetchCategories() {
    fetch(`${apiUrl}/categories`)
        .then(response => response.json())
        .then(categories => {
            const categoryDropdown = document.getElementById('categoryDropdown');
            categoryDropdown.innerHTML = '<option value="">Select a category...</option>';
            categories.forEach(category => {
                categoryDropdown.innerHTML += `<option value="${category.categoryID}">${category.categoryName}</option>`;
            });
        });
}

function searchByCategory() {
    const categoryId = document.getElementById('categoryDropdown').value;
    if (categoryId) {
        fetch(`${apiUrl}/categories/${categoryId}/products`)
            .then(response => response.json())
            .then(products => displayProducts(products));
    }
}

function fetchAllProducts() {
    fetch(`${apiUrl}/products`)
        .then(response => response.json())
        .then(products => displayProducts(products));
}

function displayProducts(products) {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '<ul>';
    products.forEach(product => {
        productsList.innerHTML += `
            <li>
                ${product.productName} - $${product.unitPrice}
                <a href="details.html?id=${product.productID}">See details</a>
            </li>
        `;
    });
    productsList.innerHTML += '</ul>';
}

function fetchProductDetails(productId) {
    fetch(`${apiUrl}/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            const productDetails = document.getElementById('productDetails');
            productDetails.innerHTML = `
                <h1>${product.productName}</h1>
                <p><strong>Price:</strong> $${product.unitPrice}</p>
                <p><strong>Quantity per unit:</strong> ${product.quantityPerUnit}</p>
                <p><strong>Category:</strong> ${product.categoryID}</p>
                <p><strong>Supplier:</strong> ${product.supplierID}</p>
            `;
        });
}