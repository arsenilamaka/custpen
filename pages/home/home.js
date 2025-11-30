document.addEventListener('DOMContentLoaded', function() {
    console.log('Home page loaded');
    
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            alert(`Вы выбрали функцию ${index + 1}`);
        });
    });
});