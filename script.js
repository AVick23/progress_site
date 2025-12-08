// Улучшенная версия скриптов
class ProgressApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupParallax();
        this.setupFormatters();
        this.setupIntersectionObserver();
        this.setupTheme();
        this.setupKeyboardNavigation();
    }

    // Мобильное меню
    setupMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('nav ul');
        
        if (!menuBtn || !navMenu) return;

        // Переключение меню
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Закрытие меню при клике вне
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                menuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        // Закрытие меню при нажатии ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navMenu.classList.remove('active');
                menuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        // Плавная прокрутка для мобильных ссылок
        document.querySelectorAll('nav a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Эффекты при скролле
    setupScrollEffects() {
        const header = document.querySelector('header');
        const backToTopBtn = this.createBackToTopButton();
        
        let lastScroll = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Эффект скрытия/показа хедера
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            // Добавление класса при скролле
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Кнопка "Наверх"
            if (currentScroll > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
            
            // Обновление активной навигации
            this.updateActiveNav();
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // Создание кнопки "Наверх"
    createBackToTopButton() {
        const btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.innerHTML = '↑';
        btn.setAttribute('aria-label', 'Наверх');
        
        btn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000;
            box-shadow: var(--shadow-lg), var(--glow);
        `;
        
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(btn);
        return btn;
    }

    // Анимации
    setupAnimations() {
        // Анимация загрузки
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('loaded');
        });

        // Эффект наведения на карточки
        document.querySelectorAll('.neumorphic').forEach(card => {
            card.addEventListener('mousedown', () => {
                card.classList.add('neumorphic-pressed');
            });
            
            card.addEventListener('mouseup', () => {
                card.classList.remove('neumorphic-pressed');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('neumorphic-pressed');
            });
            
            // 3D эффект при наведении
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = ((x - centerX) / centerX) * 5;
                const rotateX = ((centerY - y) / centerY) * 5;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateZ(10px)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });

        // Анимация цифр
        this.animateNumbers();
    }

    // Параллакс эффекты
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        
        if (parallaxElements.length === 0) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(layer => {
                const speed = layer.classList.contains('layer-1') ? 0.2 :
                             layer.classList.contains('layer-2') ? 0.4 : 0.6;
                
                const yPos = -(scrolled * speed);
                layer.style.transform = `translateY(${yPos}px)`;
            });
        }, { passive: true });
    }

    // Форматирование чисел и дат
    setupFormatters() {
        // Форматирование больших чисел
        Number.prototype.format = function() {
            if (this >= 1000000) {
                return (this / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            }
            if (this >= 1000) {
                return (this / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            }
            return this.toString();
        };

        // Форматирование дат
        Date.prototype.format = function(format = 'ru-RU') {
            return this.toLocaleDateString(format, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };
    }

    // Intersection Observer для ленивой загрузки
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Добавляем задержку для эффекта каскада
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Наблюдаем за элементами с атрибутом data-animate
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    // Обновление активной навигации
    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Анимация чисел
    animateNumbers() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const increment = target / 200;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.innerText = Math.ceil(current).format();
                    setTimeout(updateCounter, 10);
                } else {
                    counter.innerText = target.format();
                }
            };
            
            // Запускаем анимацию когда элемент видим
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
            
            observer.observe(counter);
        });
    }

    // Темная тема (добавляем поддержку переключения)
    setupTheme() {
        // Сохраняем предпочтение пользователя
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Создаем переключатель темы если нужно
        if (document.querySelector('#theme-toggle')) {
            const toggle = document.querySelector('#theme-toggle');
            toggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                // Анимация переключения
                document.documentElement.classList.add('theme-transition');
                setTimeout(() => {
                    document.documentElement.classList.remove('theme-transition');
                }, 300);
            });
        }
    }

    // Навигация с клавиатуры
    setupKeyboardNavigation() {
        // Фокус на кнопке меню при Tab
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelectorAll('nav a');
        
        if (menuBtn) {
            menuBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    menuBtn.click();
                }
            });
        }
        
        // Навигация по меню с клавишами
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextLink = navLinks[index + 1] || navLinks[0];
                    nextLink.focus();
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevLink = navLinks[index - 1] || navLinks[navLinks.length - 1];
                    prevLink.focus();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    navLinks[0].focus();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    navLinks[navLinks.length - 1].focus();
                }
            });
        });
        
        // Закрытие меню на Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const menu = document.querySelector('nav ul.active');
                if (menu) {
                    document.querySelector('.mobile-menu-btn').click();
                    document.querySelector('.mobile-menu-btn').focus();
                }
            }
        });
    }

    // Плавная прокрутка с offset
    smoothScroll(target, offset = 80) {
        const element = document.querySelector(target);
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    const app = new ProgressApp();
    
    // Глобальные обработчики
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target === '#') return;
            
            app.smoothScroll(target);
        });
    });
    
    // Плавная прокрутка для кнопок
    document.querySelectorAll('[data-scroll-to]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-scroll-to');
            app.smoothScroll(target);
        });
    });
    
    // Ленивая загрузка изображений
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Добавляем стили для бек-топ кнопки
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .back-to-top:hover {
            transform: translateY(-4px) scale(1.1) !important;
        }
        
        .back-to-top:active {
            transform: translateY(-2px) scale(0.95) !important;
        }
        
        body.menu-open {
            overflow: hidden;
        }
        
        [data-animate] {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        [data-animate].visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .theme-transition {
            transition: background-color 0.3s, color 0.3s;
        }
        
        img.loaded {
            animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});