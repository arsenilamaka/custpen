document.addEventListener('DOMContentLoaded', function () {
    console.log('Connect page loaded');

    const connectForm = document.getElementById('connectForm');

    connectForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;

        console.log('Connect form submitted:', { username, email });
        alert(`Подключение выполнено!\nПользователь: ${username}\nEmail: ${email}`);

        connectForm.reset();
    });

    const sidebarPanel = document.getElementById('sidebarPanel');
    if (sidebarPanel) {
        sidebarPanel.classList.add('open');
    };
});
// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
const historyStack = []; // Стек истории
let isMenuOpen = true; // Флаг открытого меню
let currentItem = null; // Текущий выбранный элемент

const menuData = {
    html: [
        { type: 'html-tags', text: 'Теги', content: 'HTML теги: &lt;div&gt;, &lt;p&gt;, &lt;span&gt;, &lt;a&gt; и т.д.' },
        { type: 'html-attributes', text: 'Атрибуты', content: 'Атрибуты: class, id, style, data-*' },
        { type: 'html-forms', text: 'Формы', content: 'Элементы форм: input, textarea, select' },
        { type: 'html-semantic', text: 'Семантические теги', content: '&lt;header&gt;, &lt;footer&gt;, &lt;article&gt;, &lt;section&gt;' },
        { type: 'html-tables', text: 'Таблицы', content: '&lt;table&gt;, &lt;tr&gt;, &lt;td&gt;, &lt;th&gt;' },
        { type: 'html-media', text: 'Медиа', content: '&lt;img&gt;, &lt;video&gt;, &lt;audio&gt;' },
        { type: 'html-metadata', text: 'Метаданные', content: '&lt;meta&gt;, &lt;title&gt;, &lt;link&gt;' },
        { type: 'html-lists', text: 'Списки', content: '&lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;' },
        { type: 'html-links', text: 'Ссылки', content: '&lt;a href=""&gt;, target, rel' },
        { type: 'html-text', text: 'Текст', content: '&lt;h1&gt;-&lt;h6&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;' },
        { type: 'html-containers', text: 'Контейнеры', content: '&lt;div&gt;, &lt;span&gt;, &lt;main&gt;, &lt;nav&gt;' },
        { type: 'html-embedded', text: 'Встроенные', content: '&lt;iframe&gt;, &lt;embed&gt;, &lt;object&gt;' },
        { type: 'html-scripting', text: 'Скрипты', content: '&lt;script&gt;, &lt;noscript&gt;' },
        { type: 'html-deprecated', text: 'Устаревшие', content: '&lt;font&gt;, &lt;center&gt;, &lt;marquee&gt;' },
        { type: 'html-global', text: 'Глобальные атрибуты', content: 'class, id, style, title' }
    ],
    css: [
        { type: 'css-selectors', text: 'Селекторы', content: '.class, #id, element, [attr]' },
        { type: 'css-properties', text: 'Свойства', content: 'color, font-size, margin, padding' },
        { type: 'css-values', text: 'Значения', content: 'px, %, em, rem, vw, vh' },
        { type: 'css-units', text: 'Единицы измерения', content: 'Абсолютные и относительные единицы' },
        { type: 'css-box-model', text: 'Блочная модель', content: 'margin, border, padding, content' },
        { type: 'css-position', text: 'Position', content: 'static, relative, absolute, fixed, sticky' },
        { type: 'css-display', text: 'Display', content: 'block, inline, inline-block, flex, grid' },
        { type: 'css-flexbox', text: 'Flexbox', content: 'display: flex, justify-content, align-items' },
        { type: 'css-grid', text: 'Grid', content: 'display: grid, grid-template, grid-area' },
        { type: 'css-animation', text: 'Анимация', content: '@keyframes, animation-name, duration' },
        { type: 'css-transition', text: 'Transition', content: 'transition: property duration timing' },
        { type: 'css-transform', text: 'Transform', content: 'transform: translate, rotate, scale' },
        { type: 'css-media', text: 'Media Queries', content: '@media (max-width: 768px) {...}' },
        { type: 'css-pseudo', text: 'Псевдоклассы', content: ':hover, :focus, :nth-child()' },
        { type: 'css-variables', text: 'Переменные', content: '--primary-color: #3498db; var(--primary)' }
    ],
    js: [
        { type: 'js-variables', text: 'Переменные', content: 'let, const, var - объявление переменных' },
        { type: 'js-functions', text: 'Функции', content: 'function declaration, arrow functions' },
        { type: 'js-objects', text: 'Объекты', content: '{ key: value }, Object.methods()' },
        { type: 'js-arrays', text: 'Массивы', content: '[], .map(), .filter(), .reduce()' },
        { type: 'js-loops', text: 'Циклы', content: 'for, while, for...of, for...in' },
        { type: 'js-conditionals', text: 'Условия', content: 'if, else, switch, ternary operator' },
        { type: 'js-dom', text: 'DOM', content: 'document.getElementById(), querySelector()' },
        { type: 'js-events', text: 'События', content: 'addEventListener(), click, keydown' },
        { type: 'js-es6', text: 'ES6+', content: 'let/const, arrow functions, template literals' },
        { type: 'js-promises', text: 'Промисы', content: 'Promise, .then(), .catch()' },
        { type: 'js-async', text: 'Async/Await', content: 'async function, await promise' },
        { type: 'js-classes', text: 'Классы', content: 'class, constructor, methods, inheritance' },
        { type: 'js-modules', text: 'Модули', content: 'import, export, default export' },
        { type: 'js-apis', text: 'API', content: 'Fetch API, localStorage, Web APIs' },
        { type: 'js-debug', text: 'Отладка', content: 'console.log(), debugger, DevTools' }
    ],
    tools: [
        { type: 'tools-git', text: 'Git', content: 'git init, commit, push, pull, branch' },
        { type: 'tools-npm', text: 'NPM', content: 'npm install, package.json, scripts' },
        { type: 'tools-webpack', text: 'Webpack', content: 'Module bundler, loaders, plugins' },
        { type: 'tools-vscode', text: 'VS Code', content: 'Extensions, debugger, terminals' },
        { type: 'tools-chrome', text: 'Chrome DevTools', content: 'Console, Elements, Network' },
        { type: 'tools-figma', text: 'Figma', content: 'UI/UX design, prototyping, components' },
        { type: 'tools-terminal', text: 'Терминал', content: 'CLI commands, bash, PowerShell' },
        { type: 'tools-preprocessors', text: 'Препроцессоры', content: 'Sass/SCSS, Less, PostCSS' },
        { type: 'tools-linters', text: 'Линтеры', content: 'ESLint, Stylelint, Prettier' },
        { type: 'tools-testing', text: 'Тестирование', content: 'Jest, Mocha, Cypress' },
        { type: 'tools-deployment', text: 'Деплой', content: 'Netlify, Vercel, GitHub Pages' },
        { type: 'tools-performance', text: 'Производительность', content: 'Lighthouse, Web Vitals' },
        { type: 'tools-security', text: 'Безопасность', content: 'HTTPS, CORS, XSS protection' },
        { type: 'tools-seo', text: 'SEO', content: 'meta tags, sitemap, structured data' }
    ]
};

// ===== ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ =====
const sidebarPanel = document.getElementById('sidebarPanel');
const sidebarContent = document.querySelector('.sidebar-content');
const contentTitle = document.getElementById('contentTitle');
const contentDisplay = document.getElementById('contentDisplay');
const mainContainer = document.querySelector('.container');

// ===== ФУНКЦИИ ДЛЯ РАБОТЫ С БОКОВОЙ ПАНЕЛЬЮ =====

function toggleSidebar() {
    if (!sidebarPanel || !mainContainer) return;
    
    isMenuOpen = !isMenuOpen;
    sidebarPanel.classList.toggle('open', isMenuOpen);
    mainContainer.classList.toggle('sidebar-open', isMenuOpen);
}

// ===== ФУНКЦИИ ДЛЯ СОЗДАНИЯ МЕНЮ =====

function createButton(item) {
    const btn = document.createElement('button');
    btn.className = 'sidebar-btn';
    btn.dataset.type = item.type;
    btn.textContent = item.text;
    btn.setAttribute('aria-label', `Перейти к разделу ${item.text}`);
    return btn;
}

function createSection(title, items) {
    const section = document.createElement('section');
    section.className = 'menu-section';

    const titleEl = document.createElement('h4');
    titleEl.className = 'section-title';
    titleEl.textContent = title;

    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'section-items';

    items.forEach(item => {
        itemsContainer.appendChild(createButton(item));
    });

    section.appendChild(titleEl);
    section.appendChild(itemsContainer);

    return section;
}

function initMenu() {
    if (!sidebarContent) return;

    const title = sidebarContent.querySelector('.sidebar-title');
    sidebarContent.innerHTML = '';
    if (title) {
        sidebarContent.appendChild(title);
    }

    const sections = [
        { title: 'HTML', items: menuData.html },
        { title: 'CSS', items: menuData.css },
        { title: 'JavaScript', items: menuData.js },
        { title: 'Инструменты', items: menuData.tools }
    ];

    sections.forEach(section => {
        sidebarContent.appendChild(createSection(section.title, section.items));
    });

    addButtonListeners();
}

function addButtonListeners() {
    const buttons = document.querySelectorAll('.sidebar-btn');
    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
}

// ===== ФУНКЦИИ ДЛЯ РАБОТЫ С КОНТЕНТОМ =====

function handleButtonClick(event) {
    const button = event.currentTarget;
    const type = button.dataset.type;
    const item = findMenuItem(type);

    if (item) {
        historyStack.push(item);
        currentItem = item;
        
        updateContentDisplay(item);
        highlightActiveButton(button);
        
        if (window.innerWidth <= 768 && isMenuOpen) {
            toggleSidebar();
        }
    }
}

function findMenuItem(type) {
    const allItems = [
        ...menuData.html,
        ...menuData.css,
        ...menuData.js,
        ...menuData.tools
    ];
    return allItems.find(item => item.type === type);
}

// Функция для экранирования HTML
function escapeHTML(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function updateContentDisplay(item) {
    if (!contentTitle || !contentDisplay) return;

    contentTitle.textContent = item.text;
    
    // Экранируем содержимое для безопасного отображения
    const escapedContent = escapeHTML(item.content);
    
    contentDisplay.innerHTML = `
        <div class="content-card">
            <h3>${escapeHTML(item.text)}</h3>
            <p>${escapedContent}</p>
            <div class="code-example">
                <h4>Примеры кода:</h4>
                <pre><code>${generateCodeExample(item.type)}</code></pre>
            </div>
            <div class="content-actions">
                <button class="btn btn-primary" onclick="saveBookmark('${item.type}')">
                    💾 Сохранить
                </button>
                <button class="btn btn-secondary" onclick="copyContent('${escapeHTML(item.text)}', '${escapedContent}')">
                    📋 Копировать
                </button>
                <button class="btn btn-back" onclick="goBack()">
                    ← Назад
                </button>
            </div>
        </div>
    `;
}

function generateCodeExample(type) {
    const examples = {
        'html-tags': '&lt;div class="container"&gt;\n  &lt;h1&gt;Заголовок&lt;/h1&gt;\n  &lt;p&gt;Абзац текста&lt;/p&gt;\n&lt;/div&gt;',
        'css-selectors': '.my-class {\n  color: #3498db;\n  font-size: 16px;\n}\n\n#my-id {\n  margin: 20px;\n}',
        'js-variables': '// Объявление переменных\nlet name = "Иван";\nconst age = 25;\nvar isActive = true;',
        'tools-git': '# Клонирование репозитория\ngit clone https://github.com/user/repo.git\n\n# Добавление изменений\ngit add .\ngit commit -m "Сообщение"\ngit push origin main'
    };

    if (!examples[type]) {
        if (type.startsWith('html-')) return '&lt;div&gt;Пример HTML кода&lt;/div&gt;';
        if (type.startsWith('css-')) return '.example {\n  property: value;\n}';
        if (type.startsWith('js-')) return '// Пример JavaScript кода';
        if (type.startsWith('tools-')) return '# Пример использования инструмента';
    }

    return examples[type] || '// Пример кода для этого раздела';
}

function highlightActiveButton(activeButton) {
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// ===== ФУНКЦИИ ДЛЯ НАВИГАЦИИ =====

function goBack() {
    if (historyStack.length > 1) {
        historyStack.pop();
        const prevItem = historyStack[historyStack.length - 1];
        
        if (prevItem) {
            updateContentDisplay(prevItem);
            highlightActiveButtonByType(prevItem.type);
            currentItem = prevItem;
        }
    } else {
        showHomeScreen();
    }
}

function highlightActiveButtonByType(type) {
    const buttons = document.querySelectorAll('.sidebar-btn');
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
}

function showHomeScreen() {
    if (contentTitle && contentDisplay) {
        contentTitle.textContent = 'Выберите раздел в меню';
        contentDisplay.innerHTML = `
            <div class="welcome-card">
                <h3>Добро пожаловать в справочник разработчика!</h3>
                <p>Выберите тему из бокового меню для просмотра информации.</p>
                <p>Доступные разделы:</p>
                <ul>
                    <li><strong>HTML</strong> - теги, атрибуты, формы и семантика</li>
                    <li><strong>CSS</strong> - селекторы, свойства, анимации и сетки</li>
                    <li><strong>JavaScript</strong> - переменные, функции, DOM и события</li>
                    <li><strong>Инструменты</strong> - Git, NPM, VS Code и другие</li>
                </ul>
            </div>
        `;
    }
    
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    historyStack.length = 0;
    currentItem = null;
}

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====

function saveBookmark(itemType) {
    const item = findMenuItem(itemType);
    if (item) {
        const bookmarks = JSON.parse(localStorage.getItem('custpenBookmarks') || '[]');
        
        if (!bookmarks.some(b => b.type === itemType)) {
            bookmarks.push({ 
                type: item.type, 
                text: item.text, 
                content: item.content,
                timestamp: Date.now() 
            });
            localStorage.setItem('custpenBookmarks', JSON.stringify(bookmarks));
            alert('✅ Закладка сохранена!');
        } else {
            alert('⚠️ Закладка уже существует!');
        }
    }
}

function copyContent(title, content) {
    // Декодируем HTML entities для копирования чистого текста
    const decodeHTML = (text) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = text;
        return txt.value;
    };
    
    const cleanTitle = decodeHTML(title);
    const cleanContent = decodeHTML(content);
    const text = `${cleanTitle}\n\n${cleanContent}`;
    
    navigator.clipboard.writeText(text)
        .then(() => alert('✅ Контент скопирован в буфер обмена!'))
        .catch(err => {
            console.error('Ошибка копирования:', err);
            alert('❌ Не удалось скопировать контент');
        });
}

function handleResize() {
    if (window.innerWidth > 768) {
        if (sidebarPanel) {
            sidebarPanel.classList.add('open');
            isMenuOpen = true;
        }
        if (mainContainer) {
            mainContainer.classList.add('sidebar-open');
        }
    } else {
        if (sidebarPanel) {
            sidebarPanel.classList.remove('open');
            isMenuOpen = false;
        }
        if (mainContainer) {
            mainContainer.classList.remove('sidebar-open');
        }
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ =====

function initApp() {
    console.log('CUSTPEN Library loaded');

    const connectForm = document.getElementById('connectForm');
    if (connectForm) {
        connectForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            console.log('Connect form submitted:', { username, email });
            alert(`✅ Подключение выполнено!\nПользователь: ${username}\nEmail: ${email}`);
            connectForm.reset();
        });
    }

    initMenu();

    window.addEventListener('resize', handleResize);
    handleResize();

    setTimeout(() => {
        const firstButton = document.querySelector('.sidebar-btn');
        if (firstButton) {
            firstButton.click();
        } else {
            showHomeScreen();
        }
    }, 100);
}

// ===== ЗАПУСК ПРИЛОЖЕНИЯ =====
document.addEventListener('DOMContentLoaded', initApp);