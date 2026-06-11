/**
 * ÔTAY BOX - main script
 * Handles theme toggle, navbar effects, scroll animations, mobile menu, and cart
 */

// Apply saved theme IMMEDIATELY to prevent flash of wrong theme
(function() {
    const saved = localStorage.getItem('otay-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

// Global Product Data
const productsData = [
    { id: 1, title: "Infusion Douce Nuit", category: "infusions", sub: "Tisane artisanale", price: "12,90 TND", stars: 5, reviews: 56, img: "assets/Sachets d'infusion ÔTAY.png" },
    { id: 2, title: "Mug en céramique « Pause douceur »", category: "accessoires", sub: "Accessoire artisanal", price: "18,90 TND", stars: 5, reviews: 23, img: "assets/Mug Rose Poudré ÔTAY.png" },
    { id: 4, title: "Bougie Fleur de coton", category: "bougies", sub: "Senteur naturelle", price: "16,90 TND", stars: 5, reviews: 17, img: "assets/tea_accessory_mug_1779202706641.png" },
    { id: 5, title: "Savon surgras naturel Amande douce", category: "savons", sub: "Soin bio", price: "7,90 TND", stars: 5, reviews: 31, img: "assets/sweet_treat_honey_1779202724881.png" },
    { id: 6, title: "Infusette Cuillère Cœur", category: "accessoires", sub: "Accessoire en inox", price: "9,90 TND", stars: 5, reviews: 15, img: "assets/Infusette.png" },
    { id: 8, title: "Coffret Fleuriste Rosé", category: "infusions", sub: "Premium Herbal Infusion", price: "24,90 TND", stars: 5, reviews: 12, img: "assets/tea_sachets_1779202622262.png" },
    { id: 9, title: "Miel Artisanal Raw & Bio", category: "savons", sub: "Douceur bien-être", price: "14,50 TND", stars: 5, reviews: 29, img: "assets/sweet_treat_honey_1779202724881.png" },
    { id: 10, title: "Guide Rituel Bien-être", category: "lifestyle", sub: "Inspiration & Conseils", price: "5,00 TND", stars: 5, reviews: 9, img: "assets/wellness_card_art_1779202974836.png" }
];

// Global Cart Management
window.otayCart = {
    items: JSON.parse(localStorage.getItem('otayCart')) || [],
    save() {
        localStorage.setItem('otayCart', JSON.stringify(this.items));
        this.updateUI();
    },
    add(product, quantity = 1) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.qty += quantity;
        } else {
            this.items.push({ ...product, qty: quantity });
        }
        this.save();
    },
    remove(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
    },
    updateUI() {
        const counts = document.querySelectorAll('.cart-count');
        const totalQty = this.items.reduce((sum, item) => sum + item.qty, 0);
        counts.forEach(c => {
            c.textContent = totalQty;
            c.style.transform = 'scale(1.5)';
            setTimeout(() => { c.style.transform = 'scale(1)'; }, 300);
        });
        
        const cartDropdownList = document.getElementById('cart-items');
        const cartEmpty = document.querySelector('.cart-empty');
        if (cartDropdownList && cartEmpty) {
            cartDropdownList.innerHTML = '';
            if (this.items.length === 0) {
                cartEmpty.style.display = 'block';
                cartDropdownList.style.display = 'none';
            } else {
                cartEmpty.style.display = 'none';
                cartDropdownList.style.display = 'block';
                this.items.forEach(item => {
                    const li = document.createElement('li');
                    li.style.display = 'flex';
                    li.style.justifyContent = 'space-between';
                    li.style.alignItems = 'center';
                    li.style.padding = '8px 0';
                    li.style.borderBottom = '1px solid rgba(47, 42, 37, 0.05)';
                    
                    li.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${item.img}" alt="${item.title}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                            <div style="display: flex; flex-direction: column;">
                                <span style="font-size: 0.85rem; font-weight: 500; color: #2F2A25; line-height: 1.2; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</span>
                                <span style="font-size: 0.75rem; color: #8C857E;">${item.qty} x ${item.price}</span>
                            </div>
                        </div>
                    `;
                    const removeBtn = document.createElement('button');
                    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                    removeBtn.style.border = 'none';
                    removeBtn.style.background = 'transparent';
                    removeBtn.style.cursor = 'pointer';
                    removeBtn.style.color = '#8C857E';
                    removeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        window.otayCart.remove(item.id);
                    });
                    li.appendChild(removeBtn);
                    cartDropdownList.appendChild(li);
                });
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.otayCart.updateUI();

    // --- Lazy Image Fade-In ---
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
        }
    });

    // --- Current Year in Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Theme Toggle Setup ---
    const themeBtn = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;

    // Theme already applied by IIFE above; just wire the button
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('otay-theme', newTheme);
        });
    }

    // Remove old inline onclick handlers
    document.querySelectorAll('.search-btn, .profile-btn, .cart-btn').forEach(btn => {
        btn.removeAttribute('onclick');
    });

    // Handle profile button click
    document.querySelectorAll('.profile-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'profil.html';
        });
    });

    // Handle cart button click
    document.querySelectorAll('.cart-btn').forEach(btn => {
        if (btn.id !== 'cart-toggle') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'cart.html';
            });
        }
    });

    // --- Global Search ---
    const searchBtns = document.querySelectorAll('.search-btn');
    searchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(250, 248, 245, 0.98)';
            overlay.style.zIndex = '9999';
            overlay.style.display = 'flex';
            overlay.style.flexDirection = 'column';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';

            overlay.innerHTML = `
                <button class="close-search" style="position:absolute; top:30px; right:40px; background:none; border:none; font-size:2rem; cursor:pointer; color:#2F2A25;"><i class="fa-solid fa-xmark"></i></button>
                <h2 style="font-family:'Playfair Display',serif; font-size:2.5rem; color:#2F2A25; margin-bottom:2rem;">Que recherchez-vous ?</h2>
                <form id="global-search-form" style="width: 80%; max-width: 600px; display:flex; gap:10px;">
                    <input type="text" id="global-search-input" placeholder="Thé, mug, bougie..." style="flex:1; padding:15px 25px; font-size:1.2rem; border:2px solid #5B705F; border-radius:50px; background:transparent; outline:none; color:#2F2A25;">
                    <button type="submit" style="background:#5B705F; color:#fff; border:none; padding:15px 30px; border-radius:50px; font-size:1.1rem; cursor:pointer;"><i class="fa-solid fa-magnifying-glass"></i></button>
                </form>
            `;
            document.body.appendChild(overlay);

            setTimeout(() => {
                document.getElementById('global-search-input').focus();
            }, 100);

            overlay.querySelector('.close-search').addEventListener('click', () => {
                overlay.remove();
            });

            document.getElementById('global-search-form').addEventListener('submit', (ev) => {
                ev.preventDefault();
                const q = document.getElementById('global-search-input').value.trim();
                if (q) {
                    window.location.href = 'boutique.html?search=' + encodeURIComponent(q);
                }
            });
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuBtn = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuIcon = menuBtn.querySelector('i');

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
    }

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
        if (mobileMenu.classList.contains('active')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark');
        } else {
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') &&
            !mobileMenu.contains(e.target) &&
            e.target !== menuBtn &&
            !menuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Inject extra actions into mobile menu
    if (mobileMenu && !mobileMenu.querySelector('.mobile-extra')) {
        const extraDiv = document.createElement('div');
        extraDiv.className = 'mobile-extra';
        extraDiv.style.display = 'flex';
        extraDiv.style.justifyContent = 'center';
        extraDiv.style.gap = '1.5rem';
        extraDiv.style.marginTop = '1rem';
        extraDiv.style.borderTop = '1px solid var(--border-color)';
        extraDiv.style.paddingTop = '1rem';
        
        extraDiv.innerHTML = `
            <a href="#" class="icon-btn search-btn-mobile" aria-label="Rechercher"><i class="fa-solid fa-magnifying-glass"></i></a>
            <a href="profil.html" class="icon-btn" aria-label="Mon compte"><i class="fa-regular fa-user"></i></a>
            <button class="icon-btn theme-toggle-mobile" aria-label="Basculer le thème">
                <i class="fa-solid fa-sun light-icon"></i>
                <i class="fa-solid fa-moon dark-icon"></i>
            </button>
        `;
        mobileMenu.appendChild(extraDiv);
        
        // Theme toggle logic for mobile button
        const mobileThemeBtn = extraDiv.querySelector('.theme-toggle-mobile');
        mobileThemeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('otay-theme', newTheme);
        });
        
        // Search toggle logic for mobile button
        const mobileSearchBtn = extraDiv.querySelector('.search-btn-mobile');
        mobileSearchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
        });
    }

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // --- Like / Wishlist Buttons ---
    const likedProducts = JSON.parse(localStorage.getItem('otayLiked') || '[]');

    function saveLiked() {
        localStorage.setItem('otayLiked', JSON.stringify(likedProducts));
    }

    // Attach like logic to static heart buttons (boutique page dynamically adds them)
    // We use delegation on document for dynamically created buttons
    document.addEventListener('click', (e) => {
        const heartBtn = e.target.closest('.prod-heart-btn');
        if (!heartBtn) return;
        e.stopPropagation();
        const card = heartBtn.closest('.product-card-mock');
        const productTitle = card ? card.querySelector('h3')?.textContent || '' : '';
        const icon = heartBtn.querySelector('i');
        if (!icon) return;

        if (icon.classList.contains('fa-regular')) {
            // Like it
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            heartBtn.style.color = '#E2725B';
            if (productTitle && !likedProducts.includes(productTitle)) {
                likedProducts.push(productTitle);
                saveLiked();
            }
        } else {
            // Unlike it
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            heartBtn.style.color = '';
            const idx = likedProducts.indexOf(productTitle);
            if (idx > -1) {
                likedProducts.splice(idx, 1);
                saveLiked();
            }
        }
    });

    // --- Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial animations for items above the fold
    setTimeout(() => {
        const initialElements = document.querySelectorAll('.fade-in:not(.scroll-anim)');
        initialElements.forEach(el => el.classList.add('visible'));
    }, 100);

    // Setup observer for scrolling elements
    const animElements = document.querySelectorAll('.scroll-anim');
    animElements.forEach(el => {
        el.classList.add('slide-up'); // Ensure they start offset
        scrollObserver.observe(el);
    });

    // --- Global Floating WhatsApp Button ---
    const waBtn = document.createElement('a');
    waBtn.href = "https://wa.me/21654050380?text=" + encodeURIComponent("Bonjour 🌿 Je souhaite commander une ÔTAY BOX !");
    waBtn.target = "_blank";
    waBtn.className = "global-wa-btn";
    waBtn.setAttribute('aria-label', 'Commander via WhatsApp');
    waBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
    document.body.appendChild(waBtn);

    // Keep individual product WhatsApp buttons working if they exist
    const productWhatsappBtn = document.querySelector('.btn-whatsapp');
    if (productWhatsappBtn) {
        productWhatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const title = document.getElementById('product-title')?.textContent || 'Produit ÔTAY';
            window.open(`https://wa.me/21654050380?text=` + encodeURIComponent(`Bonjour 🌿 Je souhaite commander : ${title}`));
        });
    }

    // --- Add to Cart (Box Detail Page) ---
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const qty = parseInt(document.getElementById('qty')?.textContent || '1');
            const boxProduct = {
                id: 'box-jardin-douceur',
                title: 'Box Jardin de Douceur',
                price: '59 TND',
                img: 'assets/box-jardin-douceur.png'
            };
            window.otayCart.add(boxProduct, qty);
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-check"></i> Ajouté au panier !';
            this.style.backgroundColor = '#4b6c4f';
            this.style.color = '#fff';
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.backgroundColor = '';
                this.style.color = '';
            }, 2500);
        });
    }

    // --- Static add-to-cart buttons (boutique page) ---
    const staticCartBtns = document.querySelectorAll('.add-to-cart-btn-static');
    staticCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-check"></i> Ajouté';
            this.style.backgroundColor = 'var(--accent)';
            this.style.color = '#fff';
            this.style.borderColor = 'var(--accent)';
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style = '';
            }, 2000);
        });
    });
    // --- Product Gallery Interaction ---
    window.updateMainImage = function (src) {
        const mainImg = document.getElementById('main-product-img');
        const thumbs = document.querySelectorAll('.thumb');

        if (mainImg) {
            mainImg.src = src;

            // Update active state
            thumbs.forEach(thumb => {
                if (thumb.src === src) {
                    thumb.classList.add('active');
                } else {
                    thumb.classList.remove('active');
                }
            });
        }
    };

    // --- Quantity Selector ---
    const minusBtn = document.getElementById('minus');
    const plusBtn = document.getElementById('plus');
    const qtySpan = document.getElementById('qty');

    if (minusBtn && plusBtn && qtySpan) {
        let qty = 1;
        minusBtn.addEventListener('click', () => {
            if (qty > 1) {
                qty--;
                qtySpan.textContent = qty;
            }
        });
        plusBtn.addEventListener('click', () => {
            qty++;
            qtySpan.textContent = qty;
        });
    }

    // --- Simplified Slider Logic (Optional/Legacy check) ---
    const track = document.querySelector(".slider-track");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    if (track && prevBtn && nextBtn) {
        let index = 0;
        const slideWidth = 220;

        nextBtn.addEventListener("click", () => {
            const slides = track.querySelectorAll(".slide");
            if (index < slides.length - 1) {
                index++;
                track.style.transform = `translateX(-${index * slideWidth}px)`;
            }
        });

        prevBtn.addEventListener("click", () => {
            if (index > 0) {
                index--;
                track.style.transform = `translateX(-${index * slideWidth}px)`;
            }
        });
    }
});
