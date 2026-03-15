// Products Data
const products = [
    { id: 1, name: 'سمك هامور', price: 80, unit: 'كيلو', category: 'fresh', popular: true, image: 'img/هامورا.jfif', badge: 'new' },
    { id: 2, name: 'سمك شعري', price: 60, unit: 'كيلو', category: 'fresh', popular: true, image: 'img/شعري.jfif', badge: 'sale' },
    { id: 3, name: 'سمك كنعد', price: 70, unit: 'كيلو', category: 'fresh', popular: false, image: 'img/كنعد.jfif', badge: null },
    { id: 4, name: 'روبيان طازج', price: 120, unit: 'كيلو', category: 'shellfish', popular: true, image: 'img/روبيان.jfif', badge: 'new' },
    { id: 5, name: 'سرطان بحر', price: 150, unit: 'كيلو', category: 'shellfish', popular: false, image: 'img/سرطان.jfif', badge: null },
    { id: 6, name: 'سمك فيليه مجمد', price: 50, unit: 'كيلو', category: 'frozen', popular: true, image: 'img/فيلية.jfif', badge: 'sale' },
    { id: 7, name: 'كاليماري', price: 90, unit: 'كيلو', category: 'frozen', popular: false, image: 'img/كاليماري.jfif', badge: null },
    { id: 8, name: 'سمك التونة', price: 50, unit: 'كيلو', category: 'shellfish', popular: true, image: 'img/تونه.jfif', badge: null },
    { id: 9, name: 'سمك بلطي', price: 40, unit: 'كيلو', category: 'fresh', popular: false, image: 'img/بلطي.jfif', badge: null },
    { id: 10, name: 'سمك سردين', price: 35, unit: 'كيلو', category: 'fresh', popular: true, image: 'img/سردين.jfif', badge: 'sale' },
];

// Cart State
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('all');
    renderBestSelling();
    initCountdown();
    initScrollEffects();
    initFAQ();
    initReviewSlider();
});

// Render Products
function renderProducts(filter) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    const filtered = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter || (filter === 'popular' && p.popular));

    filtered.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });

    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.textContent.includes(getFilterName(filter))) {
            btn.classList.add('active');
        }
    });
}

function getFilterName(filter) {
    const names = {
        'all': 'الكل',
        'fresh': 'طازج',
        'popular': 'شائع',
        'frozen': 'مجمد',
        'canned': 'معلب'
    };
    return names[filter] || 'الكل';
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
            ${product.badge ? `<span class="badge badge-${product.badge} product-badge">${product.badge === 'new' ? 'جديد' : 'خصم'}</span>` : ''}
            <div class="product-actions">
                <button class="action-btn" title="عرض سريع"><i class="fas fa-eye"></i></button>
                <button class="action-btn" title="أضف للمفضلة"><i class="far fa-heart"></i></button>
                <button class="action-btn" title="مقارنة"><i class="fas fa-exchange-alt"></i></button>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-meta">
                <div class="product-price">
                    ${product.price} ريال
                    <span class="unit">/ ${product.unit}</span>
                </div>
                <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                </div>
            </div>
            <button class="add-to-cart" onclick='addToCart(${JSON.stringify(product)})'>
                <i class="fas fa-cart-plus"></i>
                أضف للسلة
            </button>
        </div>
    `;
    return card;
}

function renderBestSelling() {
    const grid = document.getElementById('bestSellingGrid');
    const bestSelling = products.filter(p => p.popular).slice(0, 4);
    
    bestSelling.forEach(product => {
        grid.appendChild(createProductCard(product));
    });
}

function filterProducts(category) {
    renderProducts(category);
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Cart Functions
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if(existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    showToast('تمت الإضافة للسلة بنجاح', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if(item) {
        item.quantity += change;
        if(item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price} ريال/${item.unit}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </div>
        `;
        cartItems.appendChild(itemEl);
    });

    cartCount.textContent = count;
    cartTotal.textContent = `${total} ريال`;

    if(cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">السلة فارغة</p>';
    }
}

// UI Functions
function openModal(type) {
    document.getElementById(`${type}Modal`).classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeModal(type) {
    document.getElementById(`${type}Modal`).classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toast.className = `toast ${type}`;
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Theme Toggle
document.getElementById('themeToggle').addEventListener('click', () => {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    document.querySelector('#themeToggle i').className = 
        newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    
    localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
document.querySelector('#themeToggle i').className = 
    savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Cart Sidebar
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');

cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
});

function closeCartSidebar() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
}

closeCart.addEventListener('click', closeCartSidebar);
overlay.addEventListener('click', closeCartSidebar);

// Scroll Effects
function initScrollEffects() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if(window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Countdown
function initCountdown() {
    const deadline = new Date('2026-03-22').getTime();
    
    setInterval(() => {
        const now = new Date().getTime();
        const distance = deadline - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    }, 1000);
}

// FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(i => i.classList.remove('active'));
            
            if(!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Review Slider
function initReviewSlider() {
    const track = document.getElementById('reviewsTrack');
    const cards = track.querySelectorAll('.review-card');
    let currentIndex = 0;
    
    setInterval(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        const offset = -currentIndex * (400 + 32); // card width + gap
        track.style.transform = `translateX(${offset}px)`;
    }, 5000);
}

// Form Submissions
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('تم إرسال رسالتك بنجاح', 'success');
    e.target.reset();
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('تم تسجيل الدخول بنجاح', 'success');
    closeModal('login');
});

document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('تم إنشاء الحساب بنجاح', 'success');
    closeModal('register');
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            navLinks.classList.remove('active');
        }
    });
});

// ===== Recipe Data =====
const recipes = {
    'grilled-lemon': {
        id: 'grilled-lemon',
        title: 'سمك مشوي بالليمون',
        image: 'https://images.unsplash.com/photo-1555939561-aa9fed63f495?w=800',
        time: '30 دقيقة',
        difficulty: 'سهلة',
        servings: '4 أشخاص',
        description: 'طريقة سهلة ولذيذة لتحضير السمك المشوي مع الليمون والأعشاب الطازجة',
        ingredients: [
            'سمك هامور أو شعري (1.5 كيلو)',
            '3 حبات ليمون معصور',
            '4 فصوص ثوم مهروس',
            '2 ملعقة كبيرة زيت زيتون',
            '1 ملعقة صغيرة كمون',
            '1 ملعقة صغيرة كزبرة ناشفة',
            'ملح وفلفل أسود حسب الرغبة',
            'حزمة بقدونس مفروم',
            'شرائح ليمون للتزيين'
        ],
        steps: [
            'نظف السمك جيداً واغسله بالماء والملح والخل، ثم جففه بورق المطبخ.',
            'في وعاء، اخلط عصير الليمون، الثوم، زيت الزيتون، الكمون، الكزبرة، الملح، والفلفل.',
            'ادهن السمك بالخليط من الداخل والخارج، واتركه يتبل لمدة 30 دقيقة.',
            'سخن الشواية أو الفرن على درجة حرارة 200 مئوية.',
            'اشوِ السمك لمدة 15-20 دقيقة مع تقليبه مرة واحدة حتى ينضج تماماً.',
            'قدم السمك ساخناً مع الأرز والسلطة، وزينه بشرائح الليمون والبقدونس.'
        ],
        tips: 'لنتيجة أفضل، اترك السمك يتبل لمدة ساعة في الثلاجة. يمكن إضافة شرائح الزنجبيل للخليط لنكهة مميزة.'
    },
    'fish-soup': {
        id: 'fish-soup',
        title: 'شوربة السمك التقليدية',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800',
        time: '45 دقيقة',
        difficulty: 'متوسطة',
        servings: '6 أشخاص',
        description: 'شوربة دسمة وغنية بالنكهات مع الخضار والتوابل البحرية',
        ingredients: [
            '500 جرام فيليه سمك مقطع',
            '2 بصلة مفرومة',
            '3 فصوص ثوم',
            '2 جزرة مقطعة',
            '2 عود كرفس',
            '4 أكواب مرق سمك أو ماء',
            '1 علبة طماطم مهروسة',
            '1 ملعقة صغيرة بابريكا',
            'نصف ملعقة صغيرة كركم',
            'ملح وفلفل حسب الرغبة',
            'ورق غار وكمون'
        ],
        steps: [
            'في قدر كبير، سخن الزيت وقلب البصل والثوم حتى يذبل.',
            'أضف الجزر والكرفس وقلب لمدة 5 دقائق.',
            'أضف الطماطم المهروسة والتوابل وقلب جيداً.',
            'صب مرق السمك واتركه يغلي لمدة 15 دقيقة.',
            'أضف قطع السمك واطهِ لمدة 10 دقائق حتى ينضج.',
            'تبل بالملح والفلفل وقدم ساخناً مع الخبز.'
        ],
        tips: 'يمكن إضافة القليل من الكريمة الطازجة قبل التقديم لنكهة أغنى. استخدم مرق سمك منزلي لأفضل نتيجة.'
    },
    'crispy-fried': {
        id: 'crispy-fried',
        title: 'سمك مقلي مقرمش',
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800',
        time: '25 دقيقة',
        difficulty: 'سهلة',
        servings: '4 أشخاص',
        description: 'طريقة القلي المثالية للحصول على سمك مقرمش من الخارج وطري من الداخل',
        ingredients: [
            '6 قطع فيليه سمك',
            '1 كوب دقيق',
            'نصف كوب نشا',
            '1 ملعقة صغيرة بيكنج باودر',
            '1 ملعقة صغيرة ثوم بودرة',
            '1 ملعقة صغيرة بابريكا',
            'ملح وفلفل أسود',
            'ماء بارد للعجين',
            'زيت للقلي'
        ],
        steps: [
            'جفف قطع السمك جيداً ورشها بالملح والفلفل.',
            'في وعاء، اخلط الدقيق، النشا، البيكنج باودر، والتوابل.',
            'أضف الماء البارد تدريجياً حتى تحصل على عجينة سميكة.',
            'غمس قطع السمك في الخليط وتأكد من تغطيتها جيداً.',
            'سخن الزيت على نار متوسطة واقلي السمك حتى يصبح ذهبياً.',
            'صفي السمك على مناديل ورقية وقدمه ساخناً مع الطرطور.'
        ],
        tips: 'استخدم زيتاً ساخناً بدرجة مناسبة (180°م) لضمان قرمشة مثالية. لا تزدحم المقلاة بالقلي.'
    }
};

// ===== Recipe Modal Functions =====
function openRecipeModal(recipeId) {
    const recipe = recipes[recipeId];
    if (!recipe) return;
    
    // Fill modal data
    document.getElementById('recipeModalImg').src = recipe.image;
    document.getElementById('recipeModalTitle').textContent = recipe.title;
    document.getElementById('recipeModalTime').textContent = recipe.time;
    document.getElementById('recipeModalDifficulty').textContent = recipe.difficulty;
    document.getElementById('recipeModalServings').textContent = recipe.servings;
    
    // Ingredients
    const ingredientsList = document.getElementById('recipeModalIngredients');
    ingredientsList.innerHTML = '';
    recipe.ingredients.forEach(ing => {
        const li = document.createElement('li');
        li.textContent = ing;
        ingredientsList.appendChild(li);
    });
    
    // Steps
    const stepsList = document.getElementById('recipeModalSteps');
    stepsList.innerHTML = '';
    recipe.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        stepsList.appendChild(li);
    });
    
    // Tips
    document.getElementById('recipeModalTips').textContent = recipe.tips;
    
    // Show modal
    document.getElementById('recipeModal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRecipeModal() {
    document.getElementById('recipeModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
}

// Add click listeners to recipe buttons
document.addEventListener('DOMContentLoaded', () => {
    // Add listeners to recipe cards
    const recipeButtons = document.querySelectorAll('.recipe-card .btn-outline');
    const recipeIds = ['grilled-lemon', 'fish-soup', 'crispy-fried'];
    
    recipeButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openRecipeModal(recipeIds[index]);
        });
    });
    
    // Close modal on overlay click
    document.getElementById('overlay').addEventListener('click', () => {
        if (document.getElementById('recipeModal').classList.contains('active')) {
            closeRecipeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('recipeModal').classList.contains('active')) {
            closeRecipeModal();
        }
    });
});

