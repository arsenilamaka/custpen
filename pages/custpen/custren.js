document.addEventListener('DOMContentLoaded', function() {
    console.log('CUSTPEN Editor запущен');
    
    // Получаем элементы
    const htmlEditor = document.getElementById('html-code');
    const cssEditor = document.getElementById('css-code');
    const jsEditor = document.getElementById('js-code');
    
    const htmlNumbers = document.getElementById('html-numbers');
    const cssNumbers = document.getElementById('css-numbers');
    const jsNumbers = document.getElementById('js-numbers');
    
    const previewFrame = document.getElementById('preview-frame');
    
    // Функция обновления номеров строк
    function updateLineNumbers(textarea, numbersContainer) {
        if (!textarea || !numbersContainer) return;
        
        const lines = textarea.value.split('\n');
        const lineCount = Math.max(lines.length, 1);
        
        let numbersHTML = '';
        for (let i = 1; i <= lineCount; i++) {
            numbersHTML += `<div>${i}</div>`;
        }
        
        numbersContainer.innerHTML = numbersHTML;
        numbersContainer.scrollTop = textarea.scrollTop;
    }
    
    // Функция запуска кода (асинхронная для плавности)
    function executeCode() {
        const html = htmlEditor.value;
        const css = cssEditor.value;
        const js = jsEditor.value;
        
        const resultHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { margin: 0; padding: 20px; }
        ${css}
    </style>
</head>
<body>
    ${html}
    <script>
        ${js}
    <\/script>
</body>
</html>`;
        
        previewFrame.srcdoc = resultHTML;
    }
    
    // Настройка редактора с автообновлением
    function setupEditor(textarea, numbersContainer) {
        // Инициализация
        updateLineNumbers(textarea, numbersContainer);
        
        // При вводе
        textarea.addEventListener('input', function() {
            updateLineNumbers(this, numbersContainer);
            executeCode();
        });
        
        // При скролле
        textarea.addEventListener('scroll', function() {
            numbersContainer.scrollTop = this.scrollTop;
        });
        
        // При нажатии Enter
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                setTimeout(() => {
                    updateLineNumbers(this, numbersContainer);
                    executeCode();
                }, 0);
            }
        });
    }
    
    // Настраиваем все редакторы
    setupEditor(htmlEditor, htmlNumbers);
    setupEditor(cssEditor, cssNumbers);
    setupEditor(jsEditor, jsNumbers);
    
    // Автозапуск при загрузке
    setTimeout(executeCode, 100);
    
    // Оптимизация для быстрого ввода
    let timeout;
    function scheduleUpdate() {
        clearTimeout(timeout);
        timeout = setTimeout(executeCode, 300);
    }
    
    // Вешаем автообновление
    [htmlEditor, cssEditor, jsEditor].forEach(editor => {
        editor.addEventListener('input', scheduleUpdate);
    });
});