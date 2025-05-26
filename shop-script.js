document.addEventListener('DOMContentLoaded', function() {
    // Email Validation Function
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Newsletter Form
    const newsletterForms = document.querySelectorAll('.form.newsletter');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.querySelector('input[name="email"]').value;
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            const formData = new FormData(form);
            try {
                await fetch(form.action || '/api/newsletter', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                form.reset();
                alert('Thank you for subscribing!');
            } catch (error) {
                alert('Error subscribing. Please try again.');
            }
        });
    });

    // Contact Form
    const contactForm = document.querySelector('.form.contact');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = contactForm.querySelector('input[name="email"]').value;
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            const formData = new FormData(contactForm);
            try {
                await fetch(contactForm.action || '/api/contact', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                contactForm.reset();
                alert('Thank you for your message!');
            } catch (error) {
                alert('Error sending message. Please try again.');
            }
        });
    }

    // Feedback Form
    const feedbackForm = document.querySelector('.form.feedback');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = feedbackForm.querySelector('input[name="email"]').value;
            const rating = feedbackForm.querySelector('select[name="rating"]').value;
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            if (!rating) {
                alert('Please select a rating.');
                return;
            }
            const formData = new FormData(feedbackForm);
            try {
                await fetch(feedbackForm.action || '/api/feedback', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                feedbackForm.reset();
                alert('Thank you for your feedback!');
            } catch (error) {
                alert('Error submitting feedback. Please try again.');
            }
        });
    }

    // Cart Count
    const cartCount = document.querySelector('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    document.querySelector('.cart-icon').setAttribute('aria-label', `View cart, ${totalItems} items`);

    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            document.querySelectorAll('.category-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Category Tabs for Blog
    const tabButtons = document.querySelectorAll('.tab-btn[data-category]');
    const blogPosts = document.querySelectorAll('.blog-post');
    if (tabButtons.length && blogPosts.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const category = button.getAttribute('data-category');
                blogPosts.forEach(post => {
                    const postCategory = post.getAttribute('data-category');
                    post.style.display = category === 'all' || category === postCategory ? 'block' : 'none';
                });
            });
        });
    }

    // Customize Button
    document.querySelectorAll('.customize-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const builder = btn.previousElementSibling;
            builder.style.display = builder.style.display === 'none' ? 'block' : 'none';
        });
    });

    // Custom Builder Price
    function updateBuilderPrice(builder) {
        const basePrice = parseFloat(builder.querySelector('input[name="base"]:checked')?.nextSibling.textContent.match(/\+BWP(\d+)/)?.[1] || 0);
        let fruitPrice = 0;
        builder.querySelectorAll('input[name="fruits"]:checked').forEach(fruit => {
            fruitPrice += parseFloat(fruit.nextSibling.textContent.match(/\+BWP(\d+)/)?.[1] || 0);
        });
        let dressingPrice = parseFloat(builder.querySelector('input[name="dressing"]:checked')?.nextSibling.textContent.match(/\+BWP(\d+)/)?.[1] || 0);
        let addonPrice = 0;
        builder.querySelectorAll('input[name="addons"]:checked').forEach(addon => {
            addonPrice += parseFloat(addon.nextSibling.textContent.match(/\+BWP(\d+)/)?.[1] || 0);
        });
        const totalPrice = basePrice + fruitPrice + dressingPrice + addonPrice;
        builder.querySelector('.builder-price').textContent = `Total: BWP${totalPrice.toFixed(2)}`;
    }

    document.querySelectorAll('.custom-builder').forEach(builder => {
        builder.querySelectorAll('input[name="base"], input[name="fruits"], input[name="dressing"], input[name="addons"]').forEach(input => {
            input.addEventListener('change', () => updateBuilderPrice(builder));
        });
        builder.querySelectorAll('input[name="fruits"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (builder.querySelectorAll('input[name="fruits"]:checked').length > 4) {
                    checkbox.checked = false;
                    alert('Max 4 fruits allowed.');
                }
                updateBuilderPrice(builder);
            });
        });
    });

    // Quantity Controls
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const quantityElement = btn.parentElement.querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);
            if (btn.classList.contains('plus')) quantity++;
            else if (quantity > 1) quantity--;
            quantityElement.textContent = quantity;
        });
    });

    // Cart Functionality
    const cartIcon = document.querySelector('.cart-icon');
    const cartPreview = document.querySelector('.cart-preview');
    const closeCart = document.querySelector('.close-cart');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.total-amount');

    if (cartIcon && cartPreview && closeCart) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartPreview.classList.toggle('active');
        });
        closeCart.addEventListener('click', () => {
            cartPreview.classList.remove('active');
        });
    }

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.card');
            let productName, productPrice, productQuantity, productImg;

            if (card.classList.contains('custom-builder')) {
                productName = card.classList.contains('smoothie-builder') ? 'Custom Smoothie' : 'Custom Fruit Salad';
                productPrice = parseFloat(card.querySelector('.builder-price').textContent.replace('Total: BWP', ''));
                productQuantity = 1;
                productImg = card.classList.contains('smoothie-builder') ? 'images/custom-smoothie.jpg' : 'images/custom-fruit-salad.jpg';
            } else {
                productName = card.querySelector('h4').textContent;
                productPrice = parseFloat(card.querySelector('p').textContent.match(/BWP\s*(\d+\.\d{2})/)?.[1] || 0);
                productQuantity = parseInt(card.querySelector('.quantity')?.textContent || 1);
                productImg = card.querySelector('img')?.src || 'images/placeholder.jpg';
            }

            const existingItem = cart.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity += productQuantity;
            } else {
                cart.push({ name: productName, price: productPrice, quantity: productQuantity, img: productImg });
            }

            updateCart();
            cartPreview.classList.add('active');
        });
    });

    function updateCart() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartIcon.setAttribute('aria-label', `View cart, ${totalItems} items`);

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.textContent = 'BWP0.00';
            localStorage.setItem('cart', JSON.stringify(cart));
            return;
        }

        cartItemsContainer.innerHTML = '';
        let totalAmount = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            const cartItem = document.createElement('div');
            cartItem.className = 'card';
            cartItem.innerHTML = `
                <img src="${item.img}" alt="${item.name}" loading="lazy">
                <h4>${item.name}</h4>
                <p>BWP${item.price.toFixed(2)} x ${item.quantity} = BWP${itemTotal.toFixed(2)}</p>
                <button class="btn primary-btn remove-item">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        cartTotal.textContent = `BWP${totalAmount.toFixed(2)}`;
        localStorage.setItem('cart', JSON.stringify(cart));

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemName = btn.closest('.card').querySelector('h4').textContent;
                cart = cart.filter(item => item.name !== itemName);
                updateCart();
            });
        });
    }

    document.querySelector('.checkout-btn')?.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        window.location.href = 'checkout.html';
    });

    updateCart();
});
