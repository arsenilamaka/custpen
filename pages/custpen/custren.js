document.addEventListener("DOMContentLoaded", function () {
  console.log("CUSTPEN Editor запущен");

  const htmlEditor = document.getElementById("html-code");
  const cssEditor = document.getElementById("css-code");
  const jsEditor = document.getElementById("js-code");

  const htmlNumbers = document.getElementById("html-numbers");
  const cssNumbers = document.getElementById("css-numbers");
  const jsNumbers = document.getElementById("js-numbers");

  const previewFrame = document.getElementById("preview-frame");
  const saveBtn = document.getElementById("save-btn");

  const historyList = document.getElementById("history-list");
  const historyBtn = document.getElementById("history-btn");
  const modal = document.getElementById("history-modal");
  const modalBg = document.getElementById("modal-bg");
  const modalClose = document.getElementById("modal-close");
  const importBtn = document.getElementById("import-btn");
  const importFile = document.getElementById("import-file");


  if (!previewFrame) console.log("НЕТ iframe #preview-frame в HTML");
  if (!historyBtn) console.log("НЕТ кнопки #history-btn");
  if (!modal) console.log("НЕТ #history-modal");

  // ===== Начальный код =====
  htmlEditor.value =
    "<h1>Здарова!</h1>\n<p>Пишите код еще</p>\n<!-- Комментарий -->";
  cssEditor.value =
    "body { padding: 20px; background: #f0f0f0; }\n\nh1 { color: #1aff00; }";
  jsEditor.value = 'console.log("Привет!");';

  // ===== Номера строк =====
  function updateLineNumbers(textarea, numbersDiv) {
    const count = Math.max(textarea.value.split("\n").length, 1);
    let numbers = "";
    for (let i = 1; i <= count; i++) numbers += `<div>${i}</div>`;
    numbersDiv.innerHTML = numbers;
    numbersDiv.scrollTop = textarea.scrollTop;
  }

  function setupEditor(editor, numbersDiv) {
    updateLineNumbers(editor, numbersDiv);

    editor.addEventListener("input", function () {
      updateLineNumbers(editor, numbersDiv);
      runCode();
    });

    editor.addEventListener("scroll", function () {
      numbersDiv.scrollTop = editor.scrollTop;
    });
  }

  setupEditor(htmlEditor, htmlNumbers);
  setupEditor(cssEditor, cssNumbers);
  setupEditor(jsEditor, jsNumbers);

  // ===== Preview =====
  function runCode() {
    const html = htmlEditor.value;
    const css = cssEditor.value;
    const js = jsEditor.value;

    previewFrame.srcdoc = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin:0; padding:20px; font-family:sans-serif; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    try { ${js} } catch(e) { console.error(e); }
  <\/script>
</body>
</html>`;
  }

  // ===== История =====
  function getHistory() {
    const history = localStorage.getItem("custpen_history");
    return history ? JSON.parse(history) : [];
  }

  function saveHistory(history) {
    localStorage.setItem("custpen_history", JSON.stringify(history));
  }

  function showHistory() {
    const history = getHistory();

    if (history.length === 0) {
      historyList.innerHTML =
        '<div style="color:#999;text-align:center;padding:20px;">Нет сохраненных сниппетов</div>';
      return;
    }

    let out = "";

    history.forEach((item) => {
      const raw = (item.html || "").replace(/\n/g, " ");
      const htmlPreview = raw.substring(0, 30) + (raw.length > 30 ? "..." : "");

      out += `
        <div class="history-item">
          <div class="history-item-header">
            <div class="history-item-title">${item.title}</div>
            <div class="history-item-date">${item.date}</div>
          </div>
          <div class="history-item-preview">${htmlPreview || "(пусто)"}</div>
          <div class="history-item-actions">
            <button class="btn-load" data-id="${item.id}">Загрузить</button>
            <button class="btn-delete" data-id="${item.id}">Удалить</button>
          </div>
        </div>
      `;
    });

    historyList.innerHTML = out;

    historyList.querySelectorAll(".btn-load").forEach((btn) => {
      btn.addEventListener("click", () => loadSnippet(Number(btn.dataset.id)));
    });

    historyList.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", () => deleteSnippet(Number(btn.dataset.id)));
    });
  }
importBtn.addEventListener("click", () => {
  importFile.click();
});
importFile.addEventListener("change", () => {
  const file = importFile.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);

      if (!Array.isArray(data)) {
        alert("❌ Неверный формат файла");
        return;
      }

      // сохраняем в localStorage
      localStorage.setItem("custpen_history", JSON.stringify(data.slice(0, 10)));

      showHistory();
      alert("✅ История импортирована");
    } catch (e) {
      alert("❌ Ошибка чтения JSON");
    }
  };

  reader.readAsText(file);
  importFile.value = "";
});

  function loadSnippet(id) {
    const history = getHistory();
    const snippet = history.find((x) => x.id === id);
    if (!snippet) return;

    htmlEditor.value = snippet.html;
    cssEditor.value = snippet.css;
    jsEditor.value = snippet.js;

    updateLineNumbers(htmlEditor, htmlNumbers);
    updateLineNumbers(cssEditor, cssNumbers);
    updateLineNumbers(jsEditor, jsNumbers);

    runCode();
  }

  function deleteSnippet(id) {
    if (!confirm("Удалить?")) return;
    let history = getHistory().filter((x) => x.id !== id);
    saveHistory(history);
    showHistory();
  }
 
  // ===== Кнопки =====
  saveBtn.addEventListener("click", function () {
    const title = prompt(
      "Название сниппета:",
      "Сниппет " + new Date().toLocaleTimeString()
    );
    if (!title) return;

    const snippet = {
      id: Date.now(),
      title,
      html: htmlEditor.value,
      css: cssEditor.value,
      js: jsEditor.value,
      date: new Date().toLocaleString(),
    };

    const history = [snippet, ...getHistory()].slice(0, 10);
    saveHistory(history);
    alert("✅ Сохранено!");
  });

  historyBtn.addEventListener("click", () => {
    modal.classList.add("show");
    showHistory();
  });

  modalBg.addEventListener("click", () => modal.classList.remove("show"));
  modalClose.addEventListener("click", () => modal.classList.remove("show"));

  // ===== старт =====
  runCode();
});
