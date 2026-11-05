/* =========================================
   1. دالة الانتقال لصفحة التفاصيل وتخزين بيانات البطاقة المحددة
   ========================================= */
function goToEventDetails(buttonElement) {
    const card = buttonElement.closest('.event-card');
const rawGallery = card.getAttribute('data-gallery');
    const eventData = {
        title: card.getAttribute('data-title'),
        category: card.getAttribute('data-category'),
        location: card.getAttribute('data-location'),
        date: card.getAttribute('data-date'),
        time: card.getAttribute('data-time'),
        mainImg: card.getAttribute('data-main-img'),
        mapImg: card.getAttribute('data-map-img'),
        fullDesc: card.getAttribute('data-full-desc'),
        gallery: rawGallery ? rawGallery.split(',') : []
    };

    // حفظ بيانات الفعالية في الذاكرة المحلية
    localStorage.setItem('selectedEvent', JSON.stringify(eventData));
    window.location.href = 'event.html';
}
/* ========================================
الفلترة حسب التصنيف في الصفحة الرئيسية
===========================================*/ 
function goToCategory(categoryName) {
    // حفظ اسم التصنيف في الذاكرة المحلية بنفس المتغير الذي تبحث عنه دالة الفلترة
    localStorage.setItem('savedCategory', categoryName);
    
    // توجيه المتصفح لفتح صفحة الفعاليات
    window.location.href = 'events.html';
}

/* =========================================
   2. الفلترة وحفظ تفضيلات التصنيف
   ========================================= */
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const locationFilter = document.getElementById('locationFilter');
const dateFilter = document.getElementById('dateFilter');
const cards = document.querySelectorAll('.event-card');

function filterEvents() {
    // التأكد من وجود الفلاتر قبل التنفيذ (تجنب أخطاء في الصفحات الأخرى)
    if (!searchInput || !categoryFilter) return;

    const searchText = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    const locationValue = locationFilter.value;
    const dateValue = dateFilter ? dateFilter.value : '';

    // حفظ خيار التصنيف في الذاكرة المحلية (متطلب وظيفي)
    localStorage.setItem('savedCategory', categoryValue);

    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        const cardCategory = card.getAttribute('data-category');
        const cardLocation = card.getAttribute('data-location');
        const cardDate = card.getAttribute('data-date');

        const matchesSearch = title.includes(searchText);
        const matchesCategory = (categoryValue === 'all' || categoryValue === cardCategory);
        const matchesLocation = (locationValue === 'all' || locationValue === cardLocation);
        const matchesDate = (dateValue === '' || dateValue === cardDate);

        if (matchesSearch && matchesCategory && matchesLocation && matchesDate) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// إضافة مستمعي الأحداث للفلاتر إن وجدت
if (searchInput && categoryFilter && locationFilter) {
    searchInput.addEventListener('keyup', filterEvents);
    categoryFilter.addEventListener('change', filterEvents);
    locationFilter.addEventListener('change', filterEvents);
    if (dateFilter) dateFilter.addEventListener('change', filterEvents);
}


/* =========================================
   3. التحقق من نموذج الاتصال (صفحة contact.html)
   ========================================= */
function sendContactMessage() {
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const statusBox = document.getElementById('statusMessage');

    const nameValue = fullName.value.trim();
    const emailValue = email.value.trim();
    const messageValue = message.value.trim();

    // التحقق من الحقول الفارغة
    if (nameValue === '' || emailValue === '' || messageValue === '') {
        statusBox.style.display = 'block';
        statusBox.style.backgroundColor = '#fee2e2';
        statusBox.style.color = '#991b1b';
        statusBox.style.border = '1px solid #f87171';
        statusBox.textContent = '⚠️ يرجى ملء جميع الحقول المطلوبة قبل الإرسال.';
        return;
    }

    // رسالة النجاح الوهمية
    statusBox.style.display = 'block';
    statusBox.style.backgroundColor = '#dcfce7';
    statusBox.style.color = '#166534';
    statusBox.style.border = '1px solid #4ade80';
    statusBox.textContent = '✅ تم إرسال رسالتك بنجاح! شكراً لتواصلك.';

    // تفريغ الحقول بعد الإرسال
    fullName.value = '';
    email.value = '';
    message.value = '';
}


/* =========================================
   4. الأحداث عند تحميل الصفحة (Dark Mode + Scroll + Category Restore)
   ========================================= */
document.addEventListener("DOMContentLoaded", function() {
    
    // --- أ. تهيئة الوضع الليلي (Dark Mode) ---
    const savedTheme = localStorage.getItem('svu_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    let themeBtn = document.getElementById('themeToggle');
    const headerElement = document.querySelector('header');

    // إنشاء زر الوضع الليلي ديناميكياً إذا لم يكن موجوداً
    if (!themeBtn && headerElement) {
        themeBtn = document.createElement('button');
        themeBtn.id = 'themeToggle';
        themeBtn.className = 'theme-toggle-btn';
        themeBtn.type = 'button';
        headerElement.appendChild(themeBtn);
    }

    function updateButtonLabel() {
        if (!themeBtn) return;
        themeBtn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
    }

    updateButtonLabel();

    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode'); // تبديل صنف بسيط
            localStorage.setItem('svu_theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
            updateButtonLabel();
        });
    }

    // --- ب. قراءة تفضيلات التصنيف المحفوظة وتطبيقها ---
    if (categoryFilter) {
        const savedCategory = localStorage.getItem('savedCategory');
        if (savedCategory) {
            categoryFilter.value = savedCategory;
            filterEvents(); // تشغيل الفلترة مباشرة لتطبيق الخيار
        }
    }

    // --- ج. تعبئة بيانات صفحة التفاصيل (event.html) ---
    if (window.location.pathname.includes("event.html")) {
        const eventDataText = localStorage.getItem('selectedEvent');
        if (eventDataText) {
            const eventData = JSON.parse(eventDataText);
            document.getElementById('event-title').textContent = eventData.title;
            document.getElementById('event-category').textContent = eventData.category;
            document.getElementById('event-date').textContent = "📅 التاريخ: " + eventData.date;
            document.getElementById('event-time').textContent = "⏰ الوقت: " + eventData.time;
            document.getElementById('event-location').textContent = "📍 المكان: " + eventData.location;
            document.getElementById('event-main-img').src = eventData.mainImg;
            document.getElementById('event-map-img').src = eventData.mapImg;
            document.getElementById('event-desc').innerHTML = eventData.fullDesc;

            const galleryContainer = document.getElementById('event-gallery');
            if (galleryContainer) {
                galleryContainer.innerHTML = '';
                window.currentGallery = eventData.gallery || [];
                
                if (window.currentGallery.length > 0 && window.currentGallery[0] !== "") {
                    window.currentGallery.forEach((imgSrc, index) => {
                        const col = document.createElement('div');
                        col.className = 'col-12 col-sm-6 col-md-4'; 
                        
                        const img = document.createElement('img');
                        img.src = imgSrc;
                        img.className = 'img-fluid rounded shadow-sm w-100';
                        img.style.objectFit = 'cover';
                        img.style.height = '220px';
                        img.style.cursor = 'pointer';
                        img.style.transition = 'transform 0.2s';
                        img.onmouseover = () => img.style.transform = 'scale(1.03)';
                        img.onmouseout = () => img.style.transform = 'scale(1)';
                        img.onclick = () => openLightbox(index);
                        
                        col.appendChild(img);
                        galleryContainer.appendChild(col);
                    });
                } else {
                    galleryContainer.innerHTML = '<p class="text-muted w-100 text-center mt-3">ليس هناك صور بعد لهذه الفعالية.</p>';
                }
            }
        }
    }

    // --- د. إنشاء وتشغيل زر الصعود للأعلى (Scroll-to-top) ---
    // إنشاء الزر ديناميكياً
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scrollTopBtn';
    scrollTopBtn.innerHTML = '🔝';
    scrollTopBtn.title = 'العودة للأعلى';
    document.body.appendChild(scrollTopBtn);

    // مراقبة التمرير لإظهار أو إخفاء الزر
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show-btn');
        } else {
            scrollTopBtn.classList.remove('show-btn');
        }
    });

    // العودة للأعلى عند النقر
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // حركة صعود ناعمة
        });
    });

});
let currentImgIndex = 0;

function openLightbox(index) {
    currentImgIndex = index;
    document.getElementById('lightboxImg').src = window.currentGallery[currentImgIndex];
    const modal = new bootstrap.Modal(document.getElementById('lightboxModal'));
    modal.show();
}

function changeImage(step) {
    if (!window.currentGallery || window.currentGallery.length === 0) return;
    currentImgIndex += step;
    if (currentImgIndex >= window.currentGallery.length) {
        currentImgIndex = 0;
    } else if (currentImgIndex < 0) {
        currentImgIndex = window.currentGallery.length - 1;
    }
    document.getElementById('lightboxImg').src = window.currentGallery[currentImgIndex];
}
