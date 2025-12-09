document.addEventListener('DOMContentLoaded', () => {
    console.log('Library loaded');
    
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
        'Flexbox': `Flexbox (CSS Flexible Box Layout) - модуль для создания гибких макетов.

Основные свойства контейнера:
• display: flex - включает flexbox
• flex-direction: row | column - направление
• justify-content - выравнивание по главной оси
• align-items - выравнивание по поперечной оси
• flex-wrap: wrap - перенос элементов

Свойства элементов:
• flex-grow - может ли элемент расти
• flex-shrink - может ли сжиматься
• flex-basis - базовый размер
• flex: 1 1 200px - краткая запись`,
        
        'Переменные': 'let, const, var - объявление переменных',
        'Git': 'git init, commit, push, pull, branch'
    };

    const sidebar = document.getElementById('sidebarPanel');
    const sidebarContent = document.querySelector('.sidebar-content');
    const contentTitle = document.getElementById('contentTitle');
    const contentDisplay = document.getElementById('contentDisplay');
    const mainContainer = document.querySelector('.container');
    
    // === ДОБАВЛЕНО: Получаем кнопку меню ===
    const menuToggle = document.getElementById('menuToggle');

    function createMenu() {
        if (!sidebarContent) return;
        
        const title = sidebarContent.querySelector('.sidebar-title');
        sidebarContent.innerHTML = '';
        if (title) sidebarContent.appendChild(title);
        
        // === ДОБАВЛЕНО: Создаем контейнер для категорий с Flexbox ===
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'category-container';
        
        Object.entries(menuData).forEach(([category, items]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            
            const categoryBtn = document.createElement('button');
            categoryBtn.className = 'category-btn';
            categoryBtn.innerHTML = `
                <span>${category.toUpperCase()}</span>
                <span>▶</span>
            `;
            
            // === ИЗМЕНЕНО: Создаем выпадающий список ===
            const sublist = document.createElement('div');
            sublist.className = 'sublist';
            
            // === ДОБАВЛЕНО: Контейнер для элементов с Flexbox ===
            const itemList = document.createElement('div');
            itemList.className = 'item-list';
            
            items.forEach(item => {
                const itemBtn = document.createElement('button');
                itemBtn.className = 'item-btn';
                itemBtn.textContent = item;
                itemBtn.onclick = () => showContent(item);
                itemList.appendChild(itemBtn);
            });
            
            sublist.appendChild(itemList);
            
            // === ДОБАВЛЕНО: Обработчик для выпадающего меню ===
            categoryBtn.onclick = (e) => {
                e.stopPropagation();
                const isActive = categoryBtn.classList.toggle('active');
                sublist.classList.toggle('active', isActive);
                
                // Анимируем иконку стрелки
                const arrow = categoryBtn.querySelector('span:last-child');
                arrow.textContent = isActive ? '▼' : '▶';
                arrow.style.transform = isActive ? 'rotate(90deg)' : 'rotate(0)';
            };
            
            categoryDiv.appendChild(categoryBtn);
            categoryDiv.appendChild(sublist);
            categoryContainer.appendChild(categoryDiv);
        });
        
        sidebarContent.appendChild(categoryContainer);
        
        // Автоматически открываем первую категорию
        setTimeout(() => {
            const firstCategory = categoryContainer.querySelector('.category-btn');
            if (firstCategory) firstCategory.click();
        }, 100);
    }

    function showContent(item) {
        if (!contentTitle || !contentDisplay) return;
        
        contentTitle.textContent = item;
        
        // === ИЗМЕНЕНО: Улучшенное отображение контента ===
        contentDisplay.innerHTML = `
            <div class="content-card">
                <h3>${item}</h3>
                <div class="content-text">
                    ${formatContent(contentData[item] || 'Описание для этого раздела готовится...')}
                </div>
                ${getCodeExample(item)}
                <div class="actions">
                    <button onclick="saveItem('${item}')">
                        💾 Сохранить в избранное
                    </button>
                    <button onclick="copyContent('${item}')">
                        📋 Копировать пример
                    </button>
                </div>
            </div>
        `;
        
        // === ИЗМЕНЕНО: Подсветка активного элемента ===
        document.querySelectorAll('.item-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === item);
        });
        
        // === ДОБАВЛЕНО: На мобильных закрываем меню после выбора ===
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('open')) {
            toggleMobileMenu();
        }
    }
    
    // === ДОБАВЛЕНО: Функция форматирования текста ===
    function formatContent(text) {
        return text.split('\n').map(line => {
            if (line.trim().startsWith('•')) {
                return `<p class="list-item">${line}</p>`;
            }
            return `<p>${line}</p>`;
        }).join('');
    }

    function getCodeExample(item) {
        const examples = {
            'Теги': '&lt;div class="container"&gt;\n  &lt;h1&gt;Заголовок&lt;/h1&gt;\n&lt;/div&gt;',
            'Селекторы': '.class {\n  color: blue;\n}',
            'Flexbox': `.container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
}

.item {
  flex: 1 1 200px;
  padding: 20px;
  background: #3498db;
  color: white;
  border-radius: 8px;
}`,
            'Переменные': 'let x = 10;\nconst y = 20;',
            'Git': 'git add .\ngit commit -m "message"'
        };
        return `
            <div class="code-example">
                <h4>Пример кода:</h4>
                <pre><code>${examples[item] || '// Пример кода'}</code></pre>
            </div>
        `;
    }
    
    // === ДОБАВЛЕНО: Функция переключения мобильного меню ===
    function toggleMobileMenu() {
        if (!sidebar || !mainContainer) return;
        
        const isOpen = sidebar.classList.contains('open');
        sidebar.classList.toggle('open', !isOpen);
        mainContainer.classList.toggle('sidebar-open', !isOpen);
        
        // Обновляем текст кнопки
        if (menuToggle) {
            menuToggle.textContent = isOpen ? '☰ Меню' : '✕ Закрыть';
        }
    }
    
    // === ДОБАВЛЕНО: Глобальные функции с улучшениями ===
    window.saveItem = (item) => {
        alert(`✅ "${item}" сохранен в избранное!`);
        // Здесь можно добавить сохранение в localStorage
    };
    
    window.copyContent = (item) => {
        const codeExample = document.querySelector('.code-example code');
        const textToCopy = codeExample ? codeExample.textContent : contentData[item] || '';
        
        navigator.clipboard.writeText(textToCopy)
            .then(() => alert('📋 Текст скопирован в буфер обмена!'))
            .catch(err => console.error('Ошибка копирования:', err));
    };

    createMenu();
    
    // === ДОБАВЛЕНО: Инициализация меню ===
    if (sidebar) sidebar.classList.add('open');
    if (mainContainer) mainContainer.classList.add('sidebar-open');
    
    // === ДОБАВЛЕНО: Обработчик кнопки меню ===
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // === ДОБАВЛЕНО: Автоматически скрываем меню на мобильных ===
    if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.remove('open');
        if (mainContainer) mainContainer.classList.remove('sidebar-open');
    }
    
    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth <= 768;
        
        // === ИЗМЕНЕНО: Адаптивное управление меню ===
        if (sidebar) {
            sidebar.classList.toggle('open', !isMobile);
        }
        
        if (mainContainer) {
            mainContainer.classList.toggle('sidebar-open', !isMobile);
        }
        
        // === ДОБАВЛЕНО: Показываем/скрываем кнопку меню ===
        if (menuToggle) {
            menuToggle.style.display = isMobile ? 'block' : 'none';
        }
    });
    
    // === ДОБАВЛЕНО: Показываем приветственное сообщение ===
    setTimeout(() => {
        if (!localStorage.getItem('libraryWelcomeShown')) {
            showContent('Flexbox');
            localStorage.setItem('libraryWelcomeShown', 'true');
        }
    }, 500);
});