document.addEventListener('DOMContentLoaded', () => {
    console.log('Library loaded');

    // ===== ДАННЫЕ УРОКОВ =====
    const lessonMap = {
        // ИСПРАВЛЕННЫЕ ПУТИ
        'Flexbox': 'css/flexbox.html',
        'CSS Grid': 'css/grid.html',
        'Grid': 'css/grid.html'
    };

    const menuData = {
        html: ['Теги', 'Атрибуты', 'Формы', 'Семантика', 'Таблицы', 'Медиа', 'Метаданные', 'Списки', 'Ссылки', 'Текст', 'Контейнеры', 'Встроенные', 'Скрипты', 'Устаревшие', 'Атрибуты'],
        css: ['Селекторы', 'Свойства', 'Значения', 'Единицы', 'Блочная модель', 'Position', 'Display', 'Flexbox', 'Grid', 'Анимация', 'Transition', 'Transform', 'Media', 'Псевдоклассы', 'Переменные'],
        js: ['Переменные', 'Функции', 'Объекты', 'Массивы', 'Циклы', 'Условия', 'DOM', 'События', 'ES6+', 'Промисы', 'Async/Await', 'Классы', 'Модули', 'API', 'Отладка'],
        tools: ['Git', 'NPM', 'Webpack', 'VS Code', 'Chrome DevTools', 'Figma', 'Терминал', 'Препроцессоры', 'Линтеры', 'Тестирование', 'Деплой', 'Производительность', 'Безопасность', 'SEO']
    };

    const contentData = {
        'Теги': 'HTML теги: &lt;div&gt;, &lt;p&gt;, &lt;span&gt;, &lt;a&gt; и т.д.',
        'Атрибуты': 'Атрибуты: class, id, style, data-*',
        'Селекторы': '.class, #id, element, [attr]',
        'Переменные': 'let, const, var - объявление переменных',
        'Git': 'git init, commit, push, pull, branch'
    };

    const sidebar = document.getElementById('sidebarPanel');
    const sidebarContent = document.querySelector('.sidebar-content');
    const contentTitle = document.getElementById('contentTitle');
    const contentDisplay = document.getElementById('contentDisplay');
    const mainContainer = document.querySelector('.container');

    // ===== СОЗДАНИЕ МЕНЮ =====
    function createMenu() {
        if (!sidebarContent) return;

        const title = sidebarContent.querySelector('.sidebar-title');
        sidebarContent.innerHTML = '';
        if (title) sidebarContent.appendChild(title);

        Object.entries(menuData).forEach(([category, items]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            const categoryBtn = document.createElement('button');
            categoryBtn.className = 'category-btn';
            categoryBtn.setAttribute('data-category', category);
            categoryBtn.innerHTML = `
                <span>${category}</span>
                <span>▶</span>
            `;

            const sublist = document.createElement('div');
            sublist.className = 'sublist';

            items.forEach(item => {
                const itemBtn = document.createElement('button');
                itemBtn.className = 'item-btn';
                itemBtn.textContent = item;
                itemBtn.onclick = () => showContent(item);
                sublist.appendChild(itemBtn);
            });

            categoryBtn.onclick = () => {
                const isActive = categoryBtn.classList.toggle('active');
                sublist.classList.toggle('active', isActive);
                categoryBtn.querySelector('span:last-child').textContent = isActive ? '▼' : '▶';
            };

            categoryDiv.appendChild(categoryBtn);
            categoryDiv.appendChild(sublist);
            sidebarContent.appendChild(categoryDiv);
        });
        setTimeout(() => sidebarContent.querySelector('.category-btn')?.click(), 100);
    }

    // ===== ПОКАЗ КОНТЕНТА =====
    function showContent(item) {
        const lessonFrame = document.getElementById('lessonFrame');
        const contentDisplay = document.getElementById('contentDisplay');
        const contentTitle = document.getElementById('contentTitle');

        if (!contentTitle || !contentDisplay) return;

        // Проверяем, есть ли урок для этого пункта
        const lessonFile = lessonMap[item];

        if (lessonFile && lessonFrame) {
            // ЗАГРУЖАЕМ УРОК В IFRAME
            contentTitle.textContent = item;
            lessonFrame.src = lessonFile;  // ✅ Теперь правильный путь: css/grid.html
            lessonFrame.style.display = 'block';
            contentDisplay.style.display = 'none';

            // Сохраняем выбор
            localStorage.setItem('selectedLesson', lessonFile);
            localStorage.setItem('selectedLessonTitle', item);

            console.log('Загружаем урок:', lessonFile);
        } else {
            // СТАТИЧНЫЙ КОНТЕНТ (как было)
            contentTitle.textContent = item;
            contentDisplay.innerHTML = `
            <div class="content-card">
                <h3>${item}</h3>
                <p>${contentData[item] || 'Описание для этого раздела'}</p>
                <div class="code-example">
                    <h4>Пример кода:</h4>
                    <pre><code>${getCodeExample(item)}</code></pre>
                </div>
                <div class="actions">
                    <button onclick="saveItem('${item}')">💾 Сохранить</button>
                    <button onclick="copyText('${item}', '${contentData[item] || ''}')">📋 Копировать</button>
                </div>
            </div>
        `;
        }

        // Подсветка активного пункта меню
        document.querySelectorAll('.item-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === item);
        });
    }

    // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
    function getCodeExample(item) {
        const examples = {
            'Теги': '&lt;div class="container"&gt;\n  &lt;h1&gt;Заголовок&lt;/h1&gt;\n&lt;/div&gt;',
            'Селекторы': '.class {\n  color: blue;\n}',
            'Переменные': 'let x = 10;\nconst y = 20;',
            'Git': 'git add .\ngit commit -m "message"',
            'Flexbox': 'display: flex;\njustify-content: center;\nalign-items: center;',
            'Grid': 'display: grid;\ngrid-template-columns: 1fr 2fr 1fr;\ngap: 20px;'
        };
        return examples[item] || '// Пример кода';
    }

    window.saveItem = (item) => alert(`Сохранено: ${item}`);
    window.copyText = (title, content) => {
        navigator.clipboard.writeText(`${title}\n${content}`)
            .then(() => alert('Скопировано!'));
    };

    // ===== ВОССТАНОВЛЕНИЕ ВЫБРАННОГО УРОКА =====
    function restoreSavedLesson() {
        const savedLesson = localStorage.getItem('selectedLesson');
        const savedTitle = localStorage.getItem('selectedLessonTitle');

        if (savedLesson && savedTitle) {
            const lessonFrame = document.getElementById('lessonFrame');
            const contentDisplay = document.getElementById('contentDisplay');
            const contentTitle = document.getElementById('contentTitle');

            if (lessonFrame && contentDisplay && contentTitle) {
                setTimeout(() => {
                    lessonFrame.src = savedLesson;
                    lessonFrame.style.display = 'block';
                    contentDisplay.style.display = 'none';
                    contentTitle.textContent = savedTitle;

                    document.querySelectorAll('.item-btn').forEach(btn => {
                        if (btn.textContent === savedTitle) {
                            btn.classList.add('active');
                        }
                    });
                }, 100);
            }
        }
    }

    // ===== ИНИЦИАЛИЗАЦИЯ =====
    createMenu();
    if (sidebar) sidebar.classList.add('open');
    if (mainContainer) mainContainer.classList.add('sidebar-open');

    // Восстанавливаем сохраненный урок
    restoreSavedLesson();

    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth <= 768;
        if (sidebar) sidebar.classList.toggle('open', !isMobile);
        if (mainContainer) mainContainer.classList.toggle('sidebar-open', !isMobile);
    });
});