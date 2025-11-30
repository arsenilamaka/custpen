console.log('CUSTPEN project initialized!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    initApp();
});

function initApp() {
    const startBtn = document.getElementById('startBtn');
    
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            alert('CUSTPEN запущен! Добро пожаловать!');
            console.log('Start button clicked');
        });
    }
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Navigation to:', this.href);
        });
    });
}

function showMessage(message) {
    console.log('CUSTPEN:', message);
}
window.CUSTPEN = {
    initApp,
    showMessage
};