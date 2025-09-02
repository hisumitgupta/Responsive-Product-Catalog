
// -----------without products Json File code


// $(document).ready(function () {
//     let cartCount = 0;

//     const products = [
//         { id: 1, name: "Laptop", price: "$999", img: "https://placehold.co/200" },
//         { id: 2, name: "Headphones", price: "$199", img: "https://placehold.co/200" },
//         { id: 3, name: "Smartphone", price: "$699", img: "https://placehold.co/200" },
//         { id: 4, name: "Camera", price: "$499", img: "https://placehold.co/200" }
//     ];

//     function renderProducts(items) {
//         $("#product-list").empty();
//         items.forEach(product => {
//             $("#product-list").append(`
//         <div class="col-md-3 mb-4 product-card" data-name="${product.name.toLowerCase()}">
//           <div class="card h-100">
//             <img src="${product.img}" class="card-img-top product-img" alt="${product.name}">
//             <div class="card-body text-center">
//               <h5 class="card-title">${product.name}</h5>
//               <p class="card-text">${product.price}</p>
//               <button class="btn btn-primary add-to-cart">Add to Cart</button>
//               <button class="btn btn-danger remove-card mt-2">Remove</button>
//             </div>
//           </div>
//         </div>
//       `);
//         });
//     }

//     renderProducts(products);

//     $(document).on("click", ".add-to-cart", function () {
//         cartCount++;
//         $("#cart-count").text(cartCount);
//     });

//     $(document).on("click", ".remove-card", function () {
//         $(this).closest(".product-card").fadeOut("slow", function () {
//             $(this).remove();
//         });
//     });


//     $("#search-bar").on("keyup", function () {
//         const query = $(this).val().toLowerCase();

//         $(".product-card").each(function () {
//             const name = $(this).data("name"); 
//             if (name.includes(query)) {
//                 $(this).fadeIn();  
//             } else {
//                 $(this).fadeOut(); 
//             }
//         });
//     });
// });



// --------------with products json file code

$(document).ready(function () {
    let allProducts = [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Render products
    function renderProducts(items) {
        $("#product-list").empty();
        items.forEach(product => {
            $("#product-list").append(`
        <div class="col-md-3 mb-4 product-card" 
             data-name="${product.name.toLowerCase()}" 
             data-id="${product.id}">
          <div class="card h-100">
            <img src="${product.image}" class="card-img-top product-img card-data-cls" 
                 alt="${product.name}" data-id="${product.id}">
            <div class="card-body text-center">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.price}</p>
              <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
              <button class="btn btn-danger remove-card">Remove</button>
            </div>
          </div>
        </div>
      `);
        });
        updateCartCount();
    }

    // Load products
    $.getJSON("products.json", function (data) {
        allProducts = data;
        renderProducts(allProducts);
    });

    // Update cart count
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById("cart-count").textContent = totalItems;
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    }

    // Add to cart logic
    function addToCart(id) {
        const product = allProducts.find(p => p.id == id);
        const existing = cart.find(item => item.id == id);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
    }

    // Add to cart (from product card)
    $(document).on("click", ".add-to-cart", function () {
        const id = $(this).data("id");
        addToCart(id);
    });

    // Remove product card (not cart, just from homepage)
    $(document).on("click", ".remove-card", function () {
        $(this).closest(".product-card").fadeOut("slow", function () {
            $(this).remove();
        });
    });

    // Search filter
    $("#search-bar").on("keyup", function () {
        const query = $(this).val().toLowerCase();
        $(".product-card").each(function () {
            const name = $(this).data("name");
            if (name.includes(query)) {
                $(this).fadeIn();
            } else {
                $(this).fadeOut();
            }
        });
    });

    // Show product in modal
    $(document).on("click", ".product-img", function () {
        const id = $(this).data("id");
        const product = allProducts.find(p => p.id == id);

        if (product) {
            $("#modalTitle").text(product.name);
            $("#modalImage").attr("src", product.image).attr("alt", product.name);
            $("#modalPrice").text(product.price);
            $("#modalDesc").text(product.description || "No description available.");
            $("#modalAddToCart").data("id", product.id);
            $("#productModal").modal("show");
        }
    });

    // Modal add to cart
    $("#modalAddToCart").on("click", function () {
        const id = $(this).data("id");
        addToCart(id);
        $("#productModal").modal("hide");
    });

    // Initial cart count update
    updateCartCount();
});



// -------------------cart page code 


$(document).ready(function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateCartCount() {
        $("#cart-count").text(cart.length);
    }

    function renderCart() {
        $("#cart-items").empty();
        let total = 0;

        if (cart.length === 0) {
            $("#cart-items").html("<p class='text-center'>🛒 Your cart is empty.</p>");
            $("#cart-total").text("$0.00");
            $("#checkout-btn").hide();
            updateCartCount();
            return;
        }

        cart.forEach((item, index) => {
            const price = parseFloat(item.price);
            const subtotal = price * item.quantity;
            total += subtotal;

            $("#cart-items").append(`
              <div class="card mb-3 cart-item shadow-sm">
                <div class="card-body d-flex justify-content-between align-items-center flex-wrap">
                  <div class="d-flex align-items-center gap-3">
                    <img src="${item.image}" alt="${item.name}" class="cart-img rounded">
                    <div>
                      <h6 class="fw-bold">${item.name}</h6>
                      <p class="mb-1 text-muted">Price: ${item.price}</p>
                      <div class="quantity-controls d-flex align-items-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary decrease-qty" data-index="${index}">−</button>
                        <span class="px-2 fw-bold">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary increase-qty" data-index="${index}">+</button>
                      </div>
                    </div>
                  </div>
                  <div class="text-end mt-2 mt-md-0">
                    <p class="mb-1 fw-bold text-success">Subtotal: $${subtotal.toFixed(2)}</p>
                    <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>
                  </div>
                </div>
              </div>
            `);
        });

        $("#cart-total").text("$" + total.toFixed(2));
        $("#checkout-btn").show();
        updateCartCount();
    }

    // Initial render
    renderCart();


    $(document).on("click", ".remove-item", function () {
        const index = $(this).data("index");
        cart.splice(index, 1);
        saveCart();
        renderCart();
    });


    $(document).on("click", ".increase-qty", function () {
        const index = $(this).data("index");
        cart[index].quantity++;
        saveCart();
        renderCart();
    });

    $(document).on("click", ".decrease-qty", function () {
        const index = $(this).data("index");

        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            if (confirm("Remove this item from cart?")) {
                cart.splice(index, 1);
            }
        }

        saveCart();
        renderCart();
    });

    $("#checkout-btn").on("click", function () {
        alert("Order completed ✅");

        // Clear local storage
        localStorage.removeItem("cart");

        // Reset cart in memory
        cart = [];

        // Re-render cart
        renderCart();

        // Reset cart count in navbar
        $("#cart-count").text(0);
    });
});
