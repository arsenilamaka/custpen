document.addEventListener('DOMContentLoaded', function() {
    console.log('CUSTPEN Editor запущен');
    
    // Элементы
    const htmlEditor = document.getElementById('html-code');
    const cssEditor = document.getElementById('css-code');
    const jsEditor = document.getElementById('js-code');
    const htmlNumbers = document.getElementById('html-numbers');
    const cssNumbers = document.getElementById('css-numbers');
    const jsNumbers = document.getElementById('js-numbers');
    const previewFrame = document.getElementById('preview-frame');
    const saveBtn = document.getElementById('save-btn');
    const historyList = document.getElementById('history-list');
    
    // Начальный код
    htmlEditor.value = '<h1>Здарова!</h1>\n<p>Пишите код више ,если ви не еврей</p>\n<!-- Комментарий -->';
    cssEditor.value = 'body {\n    padding: 20px;\n    background: #f0f0f0;\n}\n\nh1 {\n    color: #1aff00ff;\n}';
    jsEditor.value = 'console.log("Привет!");\n\nfunction sayHello() {\n    alert("Hello!");\n}';
    
    // Обновить номера строк
    function updateLineNumbers(textarea, numbersDiv) {
        const lines = textarea.value.split('\n');
        const count = Math.max(lines.length, 1);
        
        let numbers = '';
        for (let i = 1; i <= count; i++) {
            numbers += '<div>' + i + '</div>';
        }
        
        numbersDiv.innerHTML = numbers;
        numbersDiv.scrollTop = textarea.scrollTop;
    }
    
    // Подсветка синтаксиса
    function applySyntaxHighlight() {
        // Устанавливаем цвет текста в textarea
        // Это простой способ - задаем цвет всего текста
        // Для настоящей подсветки нужна библиотека или сложный код
        // Но пока просто установим хороший цвет
        [htmlEditor, cssEditor, jsEditor].forEach(editor => {
            editor.style.color = '#d4d4d4';
            editor.style.fontFamily = "'Consolas', 'Monaco', 'Courier New', monospace";
        });
    }
    
    // Запустить код
    function runCode() {
        const html = htmlEditor.value;
        const css = cssEditor.value;
        const js = jsEditor.value;
        
        const fullCode = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; padding: 20px; font-family: sans-serif; }
        ${css}
    </style>
</head>
<body>
    ${html}
    <script>
        try {
            ${js}
        } catch(e) {
            console.error(e);
        }
    <\/script>
</body>
</html>`;
        
        previewFrame.srcdoc = fullCode;
    }
    
    // Настроить редактор
    function setupEditor(editor, numbers) {
        updateLineNumbers(editor, numbers);
        
        editor.addEventListener('input', function() {
            updateLineNumbers(this, numbers);
            runCode();
        });
        
        editor.addEventListener('scroll', function() {
            numbers.scrollTop = this.scrollTop;
        });
    }
    
    // Настроить все редакторы
    setupEditor(htmlEditor, htmlNumbers);
    setupEditor(cssEditor, cssNumbers);
    setupEditor(jsEditor, jsNumbers);
    
    // Применить подсветку
    applySyntaxHighlight();
    
    // ===== ИСТОРИЯ =====
    
    // Получить историю
    function getHistory() {
        const history = localStorage.getItem('custpen_history');
        return history ? JSON.parse(history) : [];
    }
    
    // Сохранить историю
    function saveHistory(history) {
        localStorage.setItem('custpen_history', JSON.stringify(history));
    }
    
    // Показать историю
    function showHistory() {
        const history = getHistory();
        
        if (history.length === 0) {
            historyList.innerHTML = '<div style="color: #999; text-align: center; padding: 20px;">Нет сохраненных сниппетов</div>';
            return;
        }
        
        let html = '';
        
        history.forEach(item => {
            const htmlPreview = item.html.substring(0, 30) + (item.html.length > 30 ? '...' : '');
            
            html += `
                <div class="history-item">
                    <div class="history-item-header">
                        <div class="history-item-title">${item.title}</div>
                        <div class="history-item-date">${item.date}</div>
                    </div>
                    <div class="history-item-preview">
                        ${htmlPreview || '(пусто)'}
                    </div>
                    <div class="history-item-actions">
                        <button class="btn-load" onclick="loadSnippet(${item.id})">Загрузить</button>
                        <button class="btn-delete" onclick="deleteSnippet(${item.id})">Удалить</button>
                    </div>
                </div>
            `;
        });
        
        historyList.innerHTML = html;
    }
    
    // Сохранить код
    saveBtn.addEventListener('click', function() {
        const title = prompt('Название сниппета:', 'Сниппет ' + new Date().toLocaleTimeString());
        if (!title) return;
        
        const snippet = {
            id: Date.now(),
            title: title,
            html: htmlEditor.value,
            css: cssEditor.value,
            js: jsEditor.value,
            date: new Date().toLocaleString()
        };
        
        let history = getHistory();
        history.unshift(snippet);
        
        // Максимум 10 записей
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        saveHistory(history);
        showHistory();
        
        alert('✅ Сохранено!');
    });
    
    // Загрузить сниппет
    window.loadSnippet = function(id) {
        const history = getHistory();
        const snippet = history.find(item => item.id === id);
        
        if (snippet && confirm(`Загрузить "${snippet.title}"?`)) {
            htmlEditor.value = snippet.html;
            cssEditor.value = snippet.css;
            jsEditor.value = snippet.js;
            
            updateLineNumbers(htmlEditor, htmlNumbers);
            updateLineNumbers(cssEditor, cssNumbers);
            updateLineNumbers(jsEditor, jsNumbers);
            
            runCode();
        }
    };
    
    // Удалить сниппет
    window.deleteSnippet = function(id) {
        if (confirm('Удалить?')) {
            let history = getHistory();
            history = history.filter(item => item.id !== id);
            saveHistory(history);
            showHistory();
        }
    };
    
    // ===== ЗАПУСК =====
    
    // Показать историю
    showHistory();
    
    // Запустить код
    runCode();
});