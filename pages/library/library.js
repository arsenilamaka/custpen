
document.addEventListener('DOMContentLoaded', () => {
    console.log('Library loaded');

    // ===== ДАННЫЕ УРОКОВ =====
    const lessonMap = {
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

        if (!contentDisplay) return;

        // Проверяем, есть ли урок для этого пункта
        const lessonFile = lessonMap[item];

        if (lessonFile && lessonFrame) {
            // ЗАГРУЖАЕМ УРОК В IFRAME
            lessonFrame.src = lessonFile;
            lessonFrame.style.display = 'block';
            contentDisplay.style.display = 'none';

            // Сохраняем выбор
            localStorage.setItem('selectedLesson', lessonFile);
            localStorage.setItem('selectedLessonTitle', item);

            console.log('Загружаем урок:', lessonFile);

            // Ждем загрузки iframe и инициализируем интерактивность
            lessonFrame.onload = () => {
                setTimeout(() => {
                    initLessonInteractivity(lessonFrame, item);
                }, 500);
            };
        } else {
            // СТАТИЧНЫЙ КОНТЕНТ

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

    // ===== ИНИЦИАЛИЗАЦИЯ ИНТЕРАКТИВНОСТИ ДЛЯ УРОКА =====
    function initLessonInteractivity(lessonFrame, lessonName) {
        try {
            const iframeWindow = lessonFrame.contentWindow;
            const iframeDocument = lessonFrame.contentDocument;

            if (!iframeWindow || !iframeDocument) {
                console.warn('Не удалось получить доступ к iframe');
                return;
            }

            // Определяем тип урока
            const isFlexbox = lessonName === 'Flexbox';
            const isGrid = lessonName === 'Grid';

            if (isFlexbox) {
                initFlexboxInteractivity(iframeWindow, iframeDocument);
            } else if (isGrid) {
                initGridInteractivity(iframeWindow, iframeDocument);
            }

            // Общие функции для всех уроков
            initCommonLessonFunctions(iframeWindow, iframeDocument, lessonName);

            console.log(`Интерактивность для урока "${lessonName}" инициализирована`);
        } catch (error) {
            console.error('Ошибка при инициализации интерактивности:', error);
        }
    }

    // ===== ИНТЕРАКТИВНОСТЬ ДЛЯ FLEXBOX =====
    function initFlexboxInteractivity(iframeWindow, iframeDocument) {
        // Функции для Flexbox
        iframeWindow.changeDirection = function (direction) {
            const demo = iframeDocument.getElementById('directionDemo');
            if (demo) {
                demo.style.flexDirection = direction;
                updateProgress('flexbox', 10);
            }
        };

        iframeWindow.changeJustify = function (justify) {
            const demo = iframeDocument.getElementById('justifyDemo');
            if (demo) {
                demo.style.justifyContent = justify;
                updateProgress('flexbox', 10);
            }
        };

        iframeWindow.changeAlign = function (align) {
            const demo = iframeDocument.getElementById('alignDemo');
            if (demo) {
                demo.style.alignItems = align;
                updateProgress('flexbox', 10);
            }
        };

        iframeWindow.updateGap = function (value) {
            const gapValue = iframeDocument.getElementById('gapValue');
            const interactiveDemo = iframeDocument.getElementById('interactiveDemo');
            if (gapValue && interactiveDemo) {
                gapValue.textContent = value + 'px';
                interactiveDemo.style.gap = value + 'px';
                updateProgress('flexbox', 5);
            }
        };

        iframeWindow.updateGrow = function (value) {
            const growValue = iframeDocument.getElementById('growValue');
            const item2 = iframeDocument.getElementById('item2');
            if (growValue && item2) {
                growValue.textContent = value;
                item2.style.flexGrow = value;
                updateProgress('flexbox', 5);
            }
        };

        iframeWindow.resetDemo = function () {
            // Сброс слайдеров
            const gapSlider = iframeDocument.getElementById('gapSlider');
            const growSlider = iframeDocument.getElementById('growSlider');
            if (gapSlider) gapSlider.value = 20;
            if (growSlider) growSlider.value = 1;

            // Сброс значений
            iframeWindow.updateGap(20);
            iframeWindow.updateGrow(1);

            // Сброс демо-контейнеров
            const directionDemo = iframeDocument.getElementById('directionDemo');
            const justifyDemo = iframeDocument.getElementById('justifyDemo');
            const alignDemo = iframeDocument.getElementById('alignDemo');

            if (directionDemo) directionDemo.style.flexDirection = 'row';
            if (justifyDemo) justifyDemo.style.justifyContent = 'center';
            if (alignDemo) alignDemo.style.alignItems = 'stretch';

            iframeWindow.alert('Демонстрация сброшена!');
        };

        // Обновляем прогресс в iframe
        const progress = localStorage.getItem('flexbox_progress') || 0;
        const progressFill = iframeDocument.getElementById('progressFill');
        const progressText = iframeDocument.getElementById('progressText');

        if (progressFill && progressText) {
            progressFill.style.width = progress + '%';
            progressText.textContent = `Прогресс: ${progress}%`;
        }
    }

    // ===== ИНТЕРАКТИВНОСТЬ ДЛЯ GRID =====
    function initGridInteractivity(iframeWindow, iframeDocument) {
        // Функции для Grid
        iframeWindow.changeColumns = function (columns) {
            const demo = iframeDocument.getElementById('columnsDemo');
            if (demo) {
                demo.style.gridTemplateColumns = columns;
                updateProgress('grid', 10);
            }
        };

        iframeWindow.changeRows = function (rows) {
            const demo = iframeDocument.getElementById('rowsDemo');
            if (demo) {
                demo.style.gridTemplateRows = rows;
                updateProgress('grid', 10);
            }
        };

        iframeWindow.updateGap = function (value) {
            const gapValue = iframeDocument.getElementById('gapValue');
            const gapDemo = iframeDocument.getElementById('gapDemo');
            if (gapValue && gapDemo) {
                gapValue.textContent = value + 'px';
                gapDemo.style.gap = value + 'px';
                updateProgress('grid', 5);
            }
        };

        iframeWindow.updateGridGap = function (value) {
            const gridGapValue = iframeDocument.getElementById('gridGapValue');
            const interactiveGridDemo = iframeDocument.getElementById('interactiveGridDemo');
            if (gridGapValue && interactiveGridDemo) {
                gridGapValue.textContent = value + 'px';
                interactiveGridDemo.style.gap = value + 'px';
                updateProgress('grid', 5);
            }
        };

        iframeWindow.updateColumns = function (value) {
            const columnsValue = iframeDocument.getElementById('columnsValue');
            const interactiveGridDemo = iframeDocument.getElementById('interactiveGridDemo');
            if (columnsValue && interactiveGridDemo) {
                columnsValue.textContent = value;
                interactiveGridDemo.style.gridTemplateColumns = `repeat(${value}, 1fr)`;
                updateProgress('grid', 5);
            }
        };

        iframeWindow.resetGridDemo = function () {
            // Сброс слайдеров
            const gridGapSlider = iframeDocument.getElementById('gridGapSlider');
            const columnsSlider = iframeDocument.getElementById('columnsSlider');
            if (gridGapSlider) gridGapSlider.value = 20;
            if (columnsSlider) columnsSlider.value = 3;

            // Сброс значений
            iframeWindow.updateGridGap(20);
            iframeWindow.updateColumns(3);

            // Сброс демо-контейнеров
            const columnsDemo = iframeDocument.getElementById('columnsDemo');
            const rowsDemo = iframeDocument.getElementById('rowsDemo');

            if (columnsDemo) columnsDemo.style.gridTemplateColumns = '1fr 2fr 1fr';
            if (rowsDemo) rowsDemo.style.gridTemplateRows = '100px 200px';

            iframeWindow.alert('Grid демонстрация сброшена!');
        };

        // Обновляем прогресс в iframe
        const progress = localStorage.getItem('grid_progress') || 0;
        const progressFill = iframeDocument.getElementById('progressFill');
        const progressText = iframeDocument.getElementById('progressText');

        if (progressFill && progressText) {
            progressFill.style.width = progress + '%';
            progressText.textContent = `Прогресс: ${progress}%`;
        }
    }

    // ===== ОБЩИЕ ФУНКЦИИ ДЛЯ ВСЕХ УРОКОВ =====
    function initCommonLessonFunctions(iframeWindow, iframeDocument, lessonName) {
        const lessonKey = lessonName.toLowerCase();

        // Печать урока
        iframeWindow.printLesson = function () {
            iframeWindow.print();
        };

        // Поделиться уроком
        iframeWindow.shareLesson = function () {
            if (navigator.share) {
                navigator.share({
                    title: `Урок ${lessonName} - CUSTPEN`,
                    text: `Изучите CSS ${lessonName} с интерактивными примерами`,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href)
                    .then(() => alert('Ссылка скопирована в буфер обмена!'));
            }
        };

        // Отметить как пройденный
        iframeWindow.markAsComplete = function () {
            const storageKey = `${lessonKey}_lesson_completed`;
            localStorage.setItem(storageKey, 'true');
            localStorage.setItem(`${storageKey}_date`, new Date().toISOString());
            updateProgress(lessonKey, 100);
            iframeWindow.alert(`🎉 Урок "${lessonName}" отмечен как пройденный!`);
        };

        // Для Grid отдельная функция
        if (lessonName === 'Grid') {
            iframeWindow.markGridAsComplete = iframeWindow.markAsComplete;
        }
    }

    // ===== ОБНОВЛЕНИЕ ПРОГРЕССА =====
    function updateProgress(lessonKey, increment) {
        const storageKey = `${lessonKey}_progress`;
        let progress = parseInt(localStorage.getItem(storageKey)) || 0;

        if (increment === 100) {
            progress = 100;
        } else {
            progress = Math.min(progress + increment, 100);
        }

        localStorage.setItem(storageKey, progress);

        // Обновляем отображение в iframe
        const lessonFrame = document.getElementById('lessonFrame');
        if (lessonFrame && lessonFrame.contentDocument) {
            const progressFill = lessonFrame.contentDocument.getElementById('progressFill');
            const progressText = lessonFrame.contentDocument.getElementById('progressText');

            if (progressFill && progressText) {
                progressFill.style.width = progress + '%';
                progressText.textContent = `Прогресс: ${progress}%`;
            }
        }

        console.log(`Прогресс урока "${lessonKey}": ${progress}%`);
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


            if (lessonFrame && contentDisplay) {
                setTimeout(() => {
                    lessonFrame.src = savedLesson;
                    lessonFrame.style.display = 'block';
                    contentDisplay.style.display = 'none';


                    document.querySelectorAll('.item-btn').forEach(btn => {
                        if (btn.textContent === savedTitle) {
                            btn.classList.add('active');
                        }
                    });

                    // Инициализируем интерактивность после загрузки
                    lessonFrame.onload = () => {
                        setTimeout(() => {
                            initLessonInteractivity(lessonFrame, savedTitle);
                        }, 500);
                    };
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

    // Проверяем, если открыли урок напрямую (не через библиотеку)
    function checkDirectLessonAccess() {
        const path = window.location.pathname;
        if (path.includes('flexbox.html') || path.includes('grid.html')) {
            console.log('Прямой доступ к уроку, добавляем базовую интерактивность');

            // Добавляем глобальные функции для прямого доступа
            if (path.includes('flexbox.html')) {
                initDirectFlexboxInteractivity();
            } else if (path.includes('grid.html')) {
                initDirectGridInteractivity();
            }
        }
    }

    // Базовые функции для прямого доступа к Flexbox
    function initDirectFlexboxInteractivity() {
        // Эти функции будут доступны в глобальной области видимости
        window.changeDirection = function (direction) {
            const demo = document.getElementById('directionDemo');
            if (demo) demo.style.flexDirection = direction;
        };

        window.changeJustify = function (justify) {
            const demo = document.getElementById('justifyDemo');
            if (demo) demo.style.justifyContent = justify;
        };

        // ... остальные функции аналогично
    }

    // Базовые функции для прямого доступа к Grid
    function initDirectGridInteractivity() {
        window.changeColumns = function (columns) {
            const demo = document.getElementById('columnsDemo');
            if (demo) demo.style.gridTemplateColumns = columns;
        };

        // ... остальные функции аналогично
    }

    // Запускаем проверку прямого доступа
    setTimeout(checkDirectLessonAccess, 100);

    console.log('Library.js полностью загружен с интерактивностью для уроков');
});
