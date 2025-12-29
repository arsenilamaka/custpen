document.addEventListener('DOMContentLoaded', () => {
    console.log('Library loaded');

    const lessonSections = {
        'Flexbox': {
            title: 'Flexbox',
            sections: [
                { id: 'flex-container', title: 'Контейнер Flexbox', anchor: '#directionDemo', elementId: 'directionDemo' },
                { id: 'flex-items', title: 'Элементы Flexbox', anchor: '#justifyDemo', elementId: 'justifyDemo' },
                { id: 'flex-properties', title: 'Свойства элементов', anchor: '#alignDemo', elementId: 'alignDemo' },
                { id: 'flex-interactive', title: 'Интерактивная демонстрация', anchor: '#interactiveDemo', elementId: 'interactiveDemo' },
                { id: 'flex-examples', title: 'Примеры кода', anchor: '.code-example', elementSelector: '.code-example' }
            ]
        },
        'Grid': {
            title: 'CSS Grid',
            sections: [
                { id: 'grid-basics', title: 'Основы Grid', anchor: '#basicGrid', elementId: 'basicGrid' },
                { id: 'grid-container', title: 'Grid Container', anchor: '#columnsDemo', elementId: 'columnsDemo' },
                { id: 'grid-items', title: 'Grid Items', anchor: '#gapDemo', elementId: 'gapDemo' },
                { id: 'grid-interactive', title: 'Интерактивная демонстрация', anchor: '#interactiveGridDemo', elementId: 'interactiveGridDemo' },
                { id: 'grid-examples', title: 'Примеры кода', anchor: '.code-example', elementSelector: '.code-example' }
            ]
        }
    };

    let navigationState = {
        currentLesson: null,
        currentSectionIndex: 0,
        isDropdownOpen: false
    };

    function scrollToSectionInIframe(section) {
        const lessonFrame = document.getElementById('lessonFrame');
        if (!lessonFrame) return;
        
        console.log('Прокрутка к секции:', section.title);
        
        if (section.id.includes('examples')) {
            scrollToCodeExamples();
            return;
        }
        
        if (section.anchor && lessonFrame.contentWindow) {
            setTimeout(() => {
                try {
                    const iframeDoc = lessonFrame.contentDocument || lessonFrame.contentWindow.document;
                    const targetElement = iframeDoc.querySelector(section.anchor);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        highlightElement(targetElement);
                    } else {
                        tryScrollViaURL(lessonFrame, section);
                    }
                } catch (error) {
                    tryScrollViaURL(lessonFrame, section);
                }
            }, 300);
        }
    }

    function tryScrollViaURL(lessonFrame, section) {
        const currentSrc = lessonFrame.src;
        if (currentSrc && !currentSrc.includes('#')) {
            const newSrc = currentSrc.split('#')[0] + section.anchor;
            lessonFrame.src = newSrc;
            setTimeout(() => { lessonFrame.src = currentSrc; }, 100);
        }
    }

    function highlightElement(element) {
        const originalBackground = element.style.backgroundColor;
        element.style.backgroundColor = 'rgba(86, 156, 214, 0.3)';
        element.style.transition = 'background-color 1s ease';
        setTimeout(() => { element.style.backgroundColor = originalBackground || ''; }, 2000);
    }

    function scrollToCodeExamples() {
        const lessonFrame = document.getElementById('lessonFrame');
        if (!lessonFrame) return;
        
        setTimeout(() => {
            try {
                const iframeDoc = lessonFrame.contentDocument || lessonFrame.contentWindow.document;
                const codeExamples = iframeDoc.querySelectorAll('.code-example');
                if (codeExamples.length > 0) {
                    codeExamples[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } catch (error) {}
        }, 300);
    }

    function goToSection(lessonName, sectionIndex) {
        const lesson = lessonSections[lessonName];
        if (!lesson || sectionIndex < 0 || sectionIndex >= lesson.sections.length) return null;
        
        navigationState.currentLesson = lessonName;
        navigationState.currentSectionIndex = sectionIndex;
        const section = lesson.sections[sectionIndex];
        
        saveNavigationState();
        updateNavigationUI();
        
        if (section.id.includes('examples')) {
            scrollToCodeExamples();
        } else {
            scrollToSectionInIframe(section);
        }
        
        return section;
    }

    function nextSection() {
        if (!navigationState.currentLesson) return;
        const lesson = lessonSections[navigationState.currentLesson];
        const nextIndex = navigationState.currentSectionIndex + 1;
        if (nextIndex < lesson.sections.length) {
            goToSection(navigationState.currentLesson, nextIndex);
        }
    }

    function prevSection() {
        if (!navigationState.currentLesson) return;
        const prevIndex = navigationState.currentSectionIndex - 1;
        if (prevIndex >= 0) {
            goToSection(navigationState.currentLesson, prevIndex);
        }
    }

    function saveNavigationState() {
        const stateToSave = {
            lesson: navigationState.currentLesson,
            sectionIndex: navigationState.currentSectionIndex,
            timestamp: new Date().toISOString(),
            pageUrl: window.location.href
        };
        localStorage.setItem('lessonNavigationState', JSON.stringify(stateToSave));
    }

    function loadNavigationState() {
        const saved = localStorage.getItem('lessonNavigationState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                const savedTime = new Date(state.timestamp);
                const currentTime = new Date();
                const hoursDiff = (currentTime - savedTime) / (1000 * 60 * 60);
                if (hoursDiff < 24 && state.lesson && lessonSections[state.lesson]) {
                    navigationState.currentLesson = state.lesson;
                    navigationState.currentSectionIndex = Math.min(state.sectionIndex || 0, lessonSections[state.lesson].sections.length - 1);
                    return true;
                } else {
                    localStorage.removeItem('lessonNavigationState');
                }
            } catch (e) {
                localStorage.removeItem('lessonNavigationState');
            }
        }
        return false;
    }

    function updateNavigationUI() {
        const dropdownBtn = document.getElementById('sectionDropdownBtn');
        const dropdownContent = document.getElementById('dropdownSections');
        const prevBtn = document.getElementById('prevSectionBtn');
        const nextBtn = document.getElementById('nextSectionBtn');

        if (!dropdownBtn || !navigationState.currentLesson) return;

        const lesson = lessonSections[navigationState.currentLesson];
        
        dropdownBtn.innerHTML = `
            <span class="lesson-name">${lesson.title}</span>
            <span class="section-counter">(${navigationState.currentSectionIndex + 1}/${lesson.sections.length})</span>
            <span class="dropdown-arrow">▼</span>
        `;

        if (dropdownContent) {
            dropdownContent.innerHTML = lesson.sections.map((section, index) => `
                <div class="dropdown-item ${index === navigationState.currentSectionIndex ? 'active' : ''}" data-index="${index}">
                    <span class="item-number">${index + 1}.</span>
                    <span class="item-title">${section.title}</span>
                    ${index === navigationState.currentSectionIndex ? '<span class="current-marker">●</span>' : ''}
                </div>
            `).join('');

            dropdownContent.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', () => {
                    const index = parseInt(item.dataset.index);
                    goToSection(navigationState.currentLesson, index);
                    dropdownContent.classList.remove('show');
                    navigationState.isDropdownOpen = false;
                });
            });
        }

        if (prevBtn) {
            prevBtn.disabled = navigationState.currentSectionIndex === 0;
            prevBtn.classList.toggle('disabled', navigationState.currentSectionIndex === 0);
        }

        if (nextBtn) {
            nextBtn.disabled = navigationState.currentSectionIndex === lesson.sections.length - 1;
            nextBtn.classList.toggle('disabled', navigationState.currentSectionIndex === lesson.sections.length - 1);
        }
    }

    function createNavigationPanel() {
        const contentArea = document.getElementById('contentArea');
        if (!contentArea) return;

        const oldNav = document.querySelector('.lesson-navigation-panel');
        if (oldNav) oldNav.remove();

        const navPanel = document.createElement('div');
        navPanel.className = 'lesson-navigation-panel';
        navPanel.innerHTML = `
            <div class="nav-container">
                <div class="dropdown-section">
                    <button class="dropdown-btn" id="sectionDropdownBtn">
                        Выберите урок
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="dropdown-content" id="dropdownSections"></div>
                </div>
                <div class="nav-buttons">
                    <button class="nav-btn prev-btn" id="prevSectionBtn" disabled>← Предыдущий раздел</button>
                    <button class="nav-btn next-btn" id="nextSectionBtn" disabled>Следующий раздел →</button>
                </div>
            </div>
        `;

        const lessonFrame = document.getElementById('lessonFrame');
        if (lessonFrame) {
            contentArea.insertBefore(navPanel, lessonFrame);
        } else {
            contentArea.prepend(navPanel);
        }

        document.getElementById('sectionDropdownBtn').addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = document.getElementById('dropdownSections');
            dropdown.classList.toggle('show');
            navigationState.isDropdownOpen = !navigationState.isDropdownOpen;
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown-section') && navigationState.isDropdownOpen) {
                document.getElementById('dropdownSections').classList.remove('show');
                navigationState.isDropdownOpen = false;
            }
        });

        const prevBtn = document.getElementById('prevSectionBtn');
        const nextBtn = document.getElementById('nextSectionBtn');
        if (prevBtn) prevBtn.addEventListener('click', prevSection);
        if (nextBtn) nextBtn.addEventListener('click', nextSection);
    }

    function initNavigationForLesson(lessonName) {
        if (!lessonSections[lessonName]) {
            const navPanel = document.querySelector('.lesson-navigation-panel');
            if (navPanel) navPanel.style.display = 'none';
            return;
        }

        const navPanel = document.querySelector('.lesson-navigation-panel');
        if (navPanel) {
            navPanel.style.display = 'flex';
            navPanel.style.opacity = '1';
        }

        navigationState.currentLesson = lessonName;
        
        const saved = localStorage.getItem('lessonNavigationState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                if (state.lesson === lessonName) {
                    navigationState.currentSectionIndex = state.sectionIndex || 0;
                }
            } catch (e) {}
        }

        updateNavigationUI();
    }

    const originalShowContent = window.showContent;
    const lessons = ['Flexbox', 'Grid'];
    let currentIndex = 0;

    window.showContent = function(item) {
        if (originalShowContent) originalShowContent(item);

        if (lessonSections[item]) {
            if (!document.querySelector('.lesson-navigation-panel')) {
                createNavigationPanel();
            }
            initNavigationForLesson(item);
            saveNavigationState();
        } else {
            const navPanel = document.querySelector('.lesson-navigation-panel');
            if (navPanel) navPanel.style.display = 'none';
        }
    };

    window.navigation = {
        goToSection: (lesson, index) => goToSection(lesson, index),
        nextSection,
        prevSection,
        getCurrentInfo: () => {
            if (!navigationState.currentLesson) return null;
            const lesson = lessonSections[navigationState.currentLesson];
            return {
                lesson: lesson.title,
                section: lesson.sections[navigationState.currentSectionIndex].title,
                current: navigationState.currentSectionIndex + 1,
                total: lesson.sections.length
            };
        },
        state: navigationState
    };

    loadNavigationState();
    createNavigationPanel();

    if (navigationState.currentLesson) {
        setTimeout(() => updateNavigationUI(), 500);
    }

    const menuData = {
        html: [],
        css: ['Flexbox', 'Grid'],
        js: [],
        tools: []
    };

    const lessonMap = {
        'Flexbox': 'css/flexbox.html',
        'Grid': 'css/grid.html'
    };

    const sidebar = document.getElementById('sidebarPanel');
    const sidebarContent = document.querySelector('.sidebar-content');
    const contentDisplay = document.getElementById('contentDisplay');
    const mainContainer = document.querySelector('.container');

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
            categoryBtn.innerHTML = `<span>${category.toUpperCase()}</span><span>▶</span>`;

            const sublist = document.createElement('div');
            sublist.className = 'sublist';

            if (items.length > 0) {
                items.forEach(item => {
                    const itemBtn = document.createElement('button');
                    itemBtn.className = 'item-btn';
                    itemBtn.textContent = item;
                    itemBtn.onclick = () => showContent(item);
                    sublist.appendChild(itemBtn);
                });
            } else {
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

        if (lessonFile && lessonFrame) {
            lessonFrame.src = lessonFile;
            lessonFrame.style.display = 'block';
            contentDisplay.style.display = 'none';
            localStorage.setItem('selectedLesson', lessonFile);
            localStorage.setItem('selectedLessonTitle', item);

            lessonFrame.onload = () => {
                setTimeout(() => {
                    initLessonInteractivity(lessonFrame, item);
                }, 500);
            };
        } else {
            contentDisplay.innerHTML = `<div class="content-card"><h3>${item}</h3><p>Урок находится в разработке</p></div>`;
            if (lessonFrame) lessonFrame.style.display = 'none';
        }

        document.querySelectorAll('.item-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === item);
        });
    }

    function initLessonInteractivity(lessonFrame, lessonName) {
        try {
            const iframeWindow = lessonFrame.contentWindow;
            const iframeDocument = lessonFrame.contentDocument;

            if (!iframeWindow || !iframeDocument) return;

            const isFlexbox = lessonName === 'Flexbox';
            const isGrid = lessonName === 'Grid';

            if (isFlexbox) {
                initFlexboxInteractivity(iframeWindow, iframeDocument);
            } else if (isGrid) {
                initGridInteractivity(iframeWindow, iframeDocument);
            }

            initCommonLessonFunctions(iframeWindow, iframeDocument, lessonName);
        } catch (error) {}
    }

    function initFlexboxInteractivity(iframeWindow, iframeDocument) {
        iframeWindow.changeDirection = function(direction) {
            const demo = iframeDocument.getElementById('directionDemo');
            if (demo) { demo.style.flexDirection = direction; updateProgress('flexbox', 10); }
        };
        iframeWindow.changeJustify = function(justify) {
            const demo = iframeDocument.getElementById('justifyDemo');
            if (demo) { demo.style.justifyContent = justify; updateProgress('flexbox', 10); }
        };
        iframeWindow.changeAlign = function(align) {
            const demo = iframeDocument.getElementById('alignDemo');
            if (demo) { demo.style.alignItems = align; updateProgress('flexbox', 10); }
        };
        iframeWindow.updateGap = function(value) {
            const gapValue = iframeDocument.getElementById('gapValue');
            const interactiveDemo = iframeDocument.getElementById('interactiveDemo');
            if (gapValue && interactiveDemo) {
                gapValue.textContent = value + 'px';
                interactiveDemo.style.gap = value + 'px';
                updateProgress('flexbox', 5);
            }
        };
        iframeWindow.updateGrow = function(value) {
            const growValue = iframeDocument.getElementById('growValue');
            const item2 = iframeDocument.getElementById('item2');
            if (growValue && item2) {
                growValue.textContent = value;
                item2.style.flexGrow = value;
                updateProgress('flexbox', 5);
            }
        };
        iframeWindow.resetDemo = function() {
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
        iframeWindow.changeColumns = function(columns) {
            const demo = iframeDocument.getElementById('columnsDemo');
            if (demo) { demo.style.gridTemplateColumns = columns; updateProgress('grid', 10); }
        };
        iframeWindow.changeRows = function(rows) {
            const demo = iframeDocument.getElementById('rowsDemo');
            if (demo) { demo.style.gridTemplateRows = rows; updateProgress('grid', 10); }
        };
        iframeWindow.updateGap = function(value) {
            const gapValue = iframeDocument.getElementById('gapValue');
            const gapDemo = iframeDocument.getElementById('gapDemo');
            if (gapValue && gapDemo) {
                gapValue.textContent = value + 'px';
                gapDemo.style.gap = value + 'px';
                updateProgress('grid', 5);
            }
        };
        iframeWindow.updateGridGap = function(value) {
            const gridGapValue = iframeDocument.getElementById('gridGapValue');
            const interactiveGridDemo = iframeDocument.getElementById('interactiveGridDemo');
            if (gridGapValue && interactiveGridDemo) {
                gridGapValue.textContent = value + 'px';
                interactiveGridDemo.style.gap = value + 'px';
                updateProgress('grid', 5);
            }
        };
        iframeWindow.updateColumns = function(value) {
            const columnsValue = iframeDocument.getElementById('columnsValue');
            const interactiveGridDemo = iframeDocument.getElementById('interactiveGridDemo');
            if (columnsValue && interactiveGridDemo) {
                columnsValue.textContent = value;
                interactiveGridDemo.style.gridTemplateColumns = `repeat(${value}, 1fr)`;
                updateProgress('grid', 5);
            }
        };
        iframeWindow.resetGridDemo = function() {
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
        iframeWindow.printLesson = function() { iframeWindow.print(); };
        iframeWindow.shareLesson = function() {
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
        iframeWindow.markAsComplete = function() {
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
                        if (btn.textContent === savedTitle) btn.classList.add('active');
                    });
                    lessonFrame.onload = () => {
                        setTimeout(() => {
                            initLessonInteractivity(lessonFrame, savedTitle);
                            if (lessonSections[savedTitle]) initNavigationForLesson(savedTitle);
                        }, 500);
                    };
                }, 100);
            }
        }
    }

    createMenu();
    if (sidebar) sidebar.classList.add('open');
    if (mainContainer) mainContainer.classList.add('sidebar-open');
    restoreSavedLesson();

    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth <= 768;
        if (sidebar) sidebar.classList.toggle('open', !isMobile);
        if (mainContainer) mainContainer.classList.toggle('sidebar-open', !isMobile);
    });

    const lessonFrame = document.getElementById('lessonFrame');
    if (lessonFrame) {
        lessonFrame.addEventListener('load', function() {
            setTimeout(() => {
                let currentLesson = null;
                if (this.src.includes('flexbox.html')) currentLesson = 'Flexbox';
                else if (this.src.includes('grid.html')) currentLesson = 'Grid';
                if (currentLesson && (!navigationState.currentLesson || navigationState.currentLesson !== currentLesson)) {
                    initNavigationForLesson(currentLesson);
                }
            }, 300);
        });
    }

    console.log('=== НАВИГАЦИЯ ГОТОВА ===');
});