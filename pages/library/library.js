document.addEventListener('DOMContentLoaded', () => {
    console.log('Library loaded');

    // ===== ДАННЫЕ УРОКОВ =====
    const lessonMap = {
        // ИСПРАВЛЕННЫЕ ПУТИ
        'Flexbox': 'css/flexbox.html',
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
            
            // 🔧 ДОБАВЛЕНО: Инициализируем интерактивность для загруженного урока
            setTimeout(initLoadedLessonInteractivity, 300);
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
                    
                    // 🔧 ДОБАВЛЕНО: Инициализируем интерактивность для восстановленного урока
                    setTimeout(initLoadedLessonInteractivity, 300);
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

    // ===== НОВЫЙ РАЗДЕЛ: ИНТЕРАКТИВНОСТЬ ДЛЯ УРОКОВ =====
    // ⭐ ДОБАВЛЕНО: Интеграция интерактивных функций для Flexbox/Grid уроков
    // ⭐ ЗАЧЕМ: Чтобы уроки имели интерактивные демонстрации без изменения HTML
    // ⭐ КАК РАБОТАЕТ: Проверяет загруженный iframe и добавляет функциональность

    // 🔧 Инициализация интерактивности для загруженного урока в iframe
    function initLoadedLessonInteractivity() {
        const lessonFrame = document.getElementById('lessonFrame');
        if (!lessonFrame || !lessonFrame.src) return;
        
        // Определяем тип урока по URL
        const isFlexbox = lessonFrame.src.includes('flexbox.html');
        const isGrid = lessonFrame.src.includes('grid.html');
        
        if (isFlexbox) {
            console.log('Инициализация интерактивности для Flexbox урока');
            initFlexboxInteractivity();
        }
        
        if (isGrid) {
            console.log('Инициализация интерактивности для Grid урока');
            initGridInteractivity();
        }
    }

    // 🔧 Интерактивные функции для Flexbox урока
    function initFlexboxInteractivity() {
        // ⚠️ Функции добавляются в глобальную область видимости window
        // чтобы их можно было вызывать из onclick в HTML урока
        
        // Изменение направления flex-direction
        window.changeDirection = function(direction) {
            const demo = document.querySelector('#lessonFrame')?.contentDocument?.getElementById('directionDemo');
            if (!demo) return;
            
            demo.style.flexDirection = direction;
            
            // Обновляем текст элементов для наглядности
            const items = demo.querySelectorAll('.demo-item');
            if (direction.includes('reverse')) {
                items.forEach((item, index) => {
                    item.textContent = 3 - index;
                });
            } else {
                items.forEach((item, index) => {
                    item.textContent = index + 1;
                });
            }
            
            updateLessonProgress('flexbox');
        };
        
        // Изменение justify-content
        window.changeJustify = function(justify) {
            const demo = document.querySelector('#lessonFrame')?.contentDocument?.getElementById('justifyDemo');
            if (demo) {
                demo.style.justifyContent = justify;
                updateLessonProgress('flexbox');
            }
        };
        
        // Изменение align-items
        window.changeAlign = function(align) {
            const demo = document.querySelector('#lessonFrame')?.contentDocument?.getElementById('alignDemo');
            if (demo) {
                demo.style.alignItems = align;
                updateLessonProgress('flexbox');
            }
        };
        
        // Обновление gap
        window.updateGap = function(value) {
            const iframeDoc = document.querySelector('#lessonFrame')?.contentDocument;
            if (!iframeDoc) return;
            
            const gapValue = iframeDoc.getElementById('gapValue');
            const interactiveDemo = iframeDoc.getElementById('interactiveDemo');
            
            if (gapValue && interactiveDemo) {
                gapValue.textContent = value + 'px';
                interactiveDemo.style.gap = value + 'px';
                updateLessonProgress('flexbox');
            }
        };
        
        // Обновление flex-grow
        window.updateGrow = function(value) {
            const iframeDoc = document.querySelector('#lessonFrame')?.contentDocument;
            if (!iframeDoc) return;
            
            const growValue = iframeDoc.getElementById('growValue');
            const item2 = iframeDoc.getElementById('item2');
            
            if (growValue && item2) {
                growValue.textContent = value;
                item2.style.flexGrow = value;
                item2.textContent = `Flex-grow: ${value}`;
                updateLessonProgress('flexbox');
            }
        };
        
        // Сброс демонстрации
        window.resetDemo = function() {
            const iframeDoc = document.querySelector('#lessonFrame')?.contentDocument;
            if (!iframeDoc) return;
            
            const gapSlider = iframeDoc.getElementById('gapSlider');
            const growSlider = iframeDoc.getElementById('growSlider');
            
            if (gapSlider && growSlider) {
                gapSlider.value = 20;
                growSlider.value = 1;
                updateGap(20);
                updateGrow(1);
                
                // Сброс всех демо
                const directionDemo = iframeDoc.getElementById('directionDemo');
                const justifyDemo = iframeDoc.getElementById('justifyDemo');
                const alignDemo = iframeDoc.getElementById('alignDemo');
                
                if (directionDemo) directionDemo.style.flexDirection = 'row';
                if (justifyDemo) justifyDemo.style.justifyContent = 'center';
                if (alignDemo) alignDemo.style.alignItems = 'stretch';
                
                alert('Демонстрация сброшена к начальным значениям!');
            }
        };
        
        // Печать урока
        window.printLesson = function() {
            const lessonFrame = document.getElementById('lessonFrame');
            if (lessonFrame && lessonFrame.contentWindow) {
                lessonFrame.contentWindow.print();
            } else {
                window.print();
            }
        };
        
        // Поделиться уроком
        window.shareLesson = function() {
            if (navigator.share) {
                navigator.share({
                    title: 'Урок Flexbox - CUSTPEN',
                    text: 'Изучите CSS Flexbox с интерактивными примерами',
                    url: window.location.href
                })
                .then(() => console.log('Урок успешно расшарен'))
                .catch(error => console.log('Ошибка шаринга:', error));
            } else {
                const url = window.location.href;
                navigator.clipboard.writeText(url)
                    .then(() => alert('Ссылка на урок скопирована в буфер обмена!'))
                    .catch(err => alert('Не удалось скопировать ссылку: ' + err));
            }
        };
        
        // Отметить как пройденный
        window.markAsComplete = function() {
            localStorage.setItem('flexbox_lesson_completed', 'true');
            localStorage.setItem('flexbox_lesson_completed_date', new Date().toISOString());
            updateLessonProgress('flexbox', 100);
            alert('🎉 Урок отмечен как пройденный! Прогресс сохранен.');
        };
        
        // Инициализация прогресса при загрузке
        const progress = localStorage.getItem('flexbox_progress') || 0;
        const iframeDoc = document.querySelector('#lessonFrame')?.contentDocument;
        if (iframeDoc) {
            const progressFill = iframeDoc.getElementById('progressFill');
            const progressText = iframeDoc.getElementById('progressText');
            
            if (progressFill && progressText) {
                progressFill.style.width = progress + '%';
                progressText.textContent = `Прогресс: ${progress}%`;
            }
        }
        
        console.log('Flexbox интерактивность инициализирована');
    }

    // 🔧 Обновление прогресса урока
    function updateLessonProgress(lessonType, specificValue = null) {
        const storageKey = `${lessonType}_progress`;
        let progress = specificValue !== null ? specificValue : parseInt(localStorage.getItem(storageKey)) || 0;
        
        if (specificValue === null && progress < 95) {
            progress += 5;
        }
        
        localStorage.setItem(storageKey, progress);
        
        // Обновляем отображение в iframe
        const iframeDoc = document.querySelector('#lessonFrame')?.contentDocument;
        if (iframeDoc) {
            const progressFill = iframeDoc.getElementById('progressFill');
            const progressText = iframeDoc.getElementById('progressText');
            
            if (progressFill && progressText) {
                progressFill.style.width = progress + '%';
                progressText.textContent = `Прогресс: ${progress}%`;
            }
        }
    }

    // 🔧 Интерактивные функции для Grid урока (заглушка)
    function initGridInteractivity() {
        console.log('Grid интерактивность загружена (заглушка)');
        // Здесь будет аналогичная логика для Grid
        // Можно добавить позже
    }

    // 🔧 Проверяем, если мы уже на странице урока (не в iframe)
    function checkIfOnLessonPage() {
        const currentPage = window.location.pathname;
        const isFlexboxPage = currentPage.includes('flexbox.html');
        const isGridPage = currentPage.includes('grid.html');
        
        if (isFlexboxPage || isGridPage) {
            console.log('Прямой доступ к уроку, инициализируем интерактивность');
            // Если открыли урок напрямую, а не через iframe
            if (isFlexboxPage) initDirectFlexboxInteractivity();
            if (isGridPage) initDirectGridInteractivity();
        }
    }

    // 🔧 Инициализация для прямого доступа к уроку Flexbox
    function initDirectFlexboxInteractivity() {
        // Логика аналогичная, но для прямого доступа (без iframe)
        // Здесь можно продублировать функции, но без обращения к contentDocument
        console.log('Прямая инициализация Flexbox урока');
    }

    // 🔧 Инициализация для прямого доступа к уроку Grid
    function initDirectGridInteractivity() {
        console.log('Прямая инициализация Grid урока (заглушка)');
    }

    // 🔧 Запускаем проверку при загрузке
    setTimeout(checkIfOnLessonPage, 100);
    
    console.log('Library.js полностью загружен с интерактивностью для уроков');
});