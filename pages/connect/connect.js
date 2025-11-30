document.addEventListener('DOMContentLoaded', function() {
    console.log('Connect page loaded');
    
    const connectForm = document.getElementById('connectForm');
    
    connectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        
        console.log('Connect form submitted:', { username, email });
        alert(`Подключение выполнено!\nПользователь: ${username}\nEmail: ${email}`);
        
        connectForm.reset();
    });
});