document.addEventListener('DOMContentLoaded', () => {
    console.log('Library loaded');

    // ===== НАЧАЛО ИЗМЕНЕНИЙ ===================================================
    //Когда добавишь файлы уроков в другие папки - просто добавь их в menuData и lessonMap//
    // Только существующие уроки по папкам
    const menuData = {
        html: [], // Папка пустая, уроков нет
        css: ['Flexbox', 'Grid'], // Только эти два урока есть
        js: [], // Папка пустая, уроков нет
        tools: [] // Папка пустая, уроков нет
    };

    const lessonMap = {
        'Flexbox': 'css/flexbox.html',
        'Grid': 'css/grid.html'
    };
    // ===== КОНЕЦ ИЗМЕНЕНИЙ ===================================================

    const sidebar = document.getElementById('sidebarPanel');
    const sidebarContent = document.querySelector('.sidebar-content');
    const contentDisplay = document.getElementById('contentDisplay');
    const mainContainer = document.querySelector('.container');

    // ===== НАЧАЛО ИЗМЕНЕНИЙ ===================================================
    function createMenu() {
        if (!sidebarContent) return;

        const title = sidebarContent.querySelector('.sidebar-title');
        sidebarContent.innerHTML = '';
        if (title) sidebarContent.appendChild(title);

        // Создаем ВСЕ 4 папки
        Object.entries(menuData).forEach(([category, items]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            const categoryBtn = document.createElement('button');
            categoryBtn.className = 'category-btn';
            categoryBtn.setAttribute('data-category', category);
            categoryBtn.innerHTML = `
                <span>${category.toUpperCase()}</span>
                <span>▶</span>
            `;

            const sublist = document.createElement('div');
            sublist.className = 'sublist';

            // Если в папке есть уроки
            if (items.length > 0) {
                items.forEach(item => {
                    const itemBtn = document.createElement('button');
                    itemBtn.className = 'item-btn';
                    itemBtn.textContent = item;
                    itemBtn.onclick = () => showContent(item);
                    sublist.appendChild(itemBtn);
                });
            } 
            // Если папка пустая
            else {
                const emptyMsg = document.createElement('div');
                emptyMsg.className = 'empty-folder';
                emptyMsg.textContent = 'Уроки в разработке';
                sublist.appendChild(emptyMsg);
            }

            categoryBtn.onclick = () => {
                const isActive = categoryBtn.classList.toggle('active');
                sublist.classList.toggle('active', isActive);
                categoryBtn.querySelector('span:last-child').textContent = isActive ? '▼' : '▶';
            };

            categoryDiv.appendChild(categoryBtn);
            categoryDiv.appendChild(sublist);
            sidebarContent.appendChild(categoryDiv);
        });
    }

    function showContent(item) {
        const lessonFrame = document.getElementById('lessonFrame');
        const contentDisplay = document.getElementById('contentDisplay');

        if (!contentDisplay) return;

        const lessonFile = lessonMap[item];

        // Если урок существует
        if (lessonFile && lessonFrame) {
            lessonFrame.src = lessonFile;
            lessonFrame.style.display = 'block';
            contentDisplay.style.display = 'none';
            localStorage.setItem('selectedLesson', lessonFile);
            localStorage.setItem('selectedLessonTitle', item);

            console.log('Загружаем урок:', lessonFile);

            lessonFrame.onload = () => {
                setTimeout(() => {
                    initLessonInteractivity(lessonFrame, item);
                }, 500);
            };
        } 
        // Если урока нет (пустая папка)
        else {
            contentDisplay.innerHTML = `
                <div class="content-card">
                    <h3>${item}</h3>
                    <p>Урок находится в разработке</p>
                </div>
            `;
            if (lessonFrame) lessonFrame.style.display = 'none';
        }

        document.querySelectorAll('.item-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === item);
        });
    }
    // ===== КОНЕЦ ИЗМЕНЕНИЙ ===================================================

    // ===== ОСТАЛЬНОЙ КОД БЕЗ ИЗМЕНЕНИЙ =======================================
    function initLessonInteractivity(lessonFrame, lessonName) {
        try {
            const iframeWindow = lessonFrame.contentWindow;
            const iframeDocument = lessonFrame.contentDocument;

            if (!iframeWindow || !iframeDocument) {
                console.warn('Не удалось получить доступ к iframe');
                return;
            }

            const isFlexbox = lessonName === 'Flexbox';
            const isGrid = lessonName === 'Grid';

            if (isFlexbox) {
                initFlexboxInteractivity(iframeWindow, iframeDocument);
            } else if (isGrid) {
                initGridInteractivity(iframeWindow, iframeDocument);
            }

            initCommonLessonFunctions(iframeWindow, iframeDocument, lessonName);
            console.log(`Интерактивность для урока "${lessonName}" инициализирована`);
        } catch (error) {
            console.error('Ошибка при инициализации интерактивности:', error);
        }
    }

    function initFlexboxInteractivity(iframeWindow, iframeDocument) {
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
            const gapSlider = iframeDocument.getElementById('gapSlider');
            const growSlider = iframeDocument.getElementById('growSlider');
            if (gapSlider) gapSlider.value = 20;
            if (growSlider) growSlider.value = 1;

            iframeWindow.updateGap(20);
            iframeWindow.updateGrow(1);

            const directionDemo = iframeDocument.getElementById('directionDemo');
            const justifyDemo = iframeDocument.getElementById('justifyDemo');
            const alignDemo = iframeDocument.getElementById('alignDemo');

            if (directionDemo) directionDemo.style.flexDirection = 'row';
            if (justifyDemo) justifyDemo.style.justifyContent = 'center';
            if (alignDemo) alignDemo.style.alignItems = 'stretch';

            iframeWindow.alert('Демонстрация сброшена!');
        };

        const progress = localStorage.getItem('flexbox_progress') || 0;
        const progressFill = iframeDocument.getElementById('progressFill');
        const progressText = iframeDocument.getElementById('progressText');

        if (progressFill && progressText) {
            progressFill.style.width = progress + '%';
            progressText.textContent = `Прогресс: ${progress}%`;
        }
    }

    function initGridInteractivity(iframeWindow, iframeDocument) {
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
            const gridGapSlider = iframeDocument.getElementById('gridGapSlider');
            const columnsSlider = iframeDocument.getElementById('columnsSlider');
            if (gridGapSlider) gridGapSlider.value = 20;
            if (columnsSlider) columnsSlider.value = 3;

            iframeWindow.updateGridGap(20);
            iframeWindow.updateColumns(3);

            const columnsDemo = iframeDocument.getElementById('columnsDemo');
            const rowsDemo = iframeDocument.getElementById('rowsDemo');

            if (columnsDemo) columnsDemo.style.gridTemplateColumns = '1fr 2fr 1fr';
            if (rowsDemo) rowsDemo.style.gridTemplateRows = '100px 200px';

            iframeWindow.alert('Grid демонстрация сброшена!');
        };

        const progress = localStorage.getItem('grid_progress') || 0;
        const progressFill = iframeDocument.getElementById('progressFill');
        const progressText = iframeDocument.getElementById('progressText');

        if (progressFill && progressText) {
            progressFill.style.width = progress + '%';
            progressText.textContent = `Прогресс: ${progress}%`;
        }
    }

    function initCommonLessonFunctions(iframeWindow, iframeDocument, lessonName) {
        const lessonKey = lessonName.toLowerCase();

        iframeWindow.printLesson = function () {
            iframeWindow.print();
        };

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

        iframeWindow.markAsComplete = function () {
            const storageKey = `${lessonKey}_lesson_completed`;
            localStorage.setItem(storageKey, 'true');
            localStorage.setItem(`${storageKey}_date`, new Date().toISOString());
            updateProgress(lessonKey, 100);
            iframeWindow.alert(`🎉 Урок "${lessonName}" отмечен как пройденный!`);
        };

        if (lessonName === 'Grid') {
            iframeWindow.markGridAsComplete = iframeWindow.markAsComplete;
        }
    }

    function updateProgress(lessonKey, increment) {
        const storageKey = `${lessonKey}_progress`;
        let progress = parseInt(localStorage.getItem(storageKey)) || 0;

        if (increment === 100) {
            progress = 100;
        } else {
            progress = Math.min(progress + increment, 100);
        }

        localStorage.setItem(storageKey, progress);

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

                    lessonFrame.onload = () => {
                        setTimeout(() => {
                            initLessonInteractivity(lessonFrame, savedTitle);
                        }, 500);
                    };
                }, 100);
            }
        }
    }

    // Инициализация
    createMenu();
    
    if (sidebar) sidebar.classList.add('open');
    if (mainContainer) mainContainer.classList.add('sidebar-open');

    restoreSavedLesson();

    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth <= 768;
        if (sidebar) sidebar.classList.toggle('open', !isMobile);
        if (mainContainer) mainContainer.classList.toggle('sidebar-open', !isMobile);
    });

    function checkDirectLessonAccess() {
        const path = window.location.pathname;
        if (path.includes('flexbox.html') || path.includes('grid.html')) {
            console.log('Прямой доступ к уроку, добавляем базовую интерактивность');

            if (path.includes('flexbox.html')) {
                initDirectFlexboxInteractivity();
            } else if (path.includes('grid.html')) {
                initDirectGridInteractivity();
            }
        }
    }

    function initDirectFlexboxInteractivity() {
        window.changeDirection = function (direction) {
            const demo = document.getElementById('directionDemo');
            if (demo) demo.style.flexDirection = direction;
        };

        window.changeJustify = function (justify) {
            const demo = document.getElementById('justifyDemo');
            if (demo) demo.style.justifyContent = justify;
        };
    }

    function initDirectGridInteractivity() {
        window.changeColumns = function (columns) {
            const demo = document.getElementById('columnsDemo');
            if (demo) demo.style.gridTemplateColumns = columns;
        };
    }

    setTimeout(checkDirectLessonAccess, 100);

    console.log('Library.js загружен: структура папок сохранена, несуществующие уроки убраны');
});