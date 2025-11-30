document.addEventListener('DOMContentLoaded', function() {
    console.log('Orders page loaded');
    
    const ordersList = document.getElementById('ordersList');
    const addOrderBtn = document.getElementById('addOrderBtn');
    let orderCount = 0;
    
    function addOrder() {
        orderCount++;
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-info">
                <strong>Заказ #${orderCount}</strong>
                <p>Статус: В обработке</p>
            </div>
            <div class="order-actions">
                <button class="delete-btn" onclick="this.parentElement.parentElement.remove()">Удалить</button>
            </div>
        `;
        ordersList.appendChild(orderItem);
    }
    
    addOrderBtn.addEventListener('click', addOrder);
    
    addOrder();
    addOrder();
});