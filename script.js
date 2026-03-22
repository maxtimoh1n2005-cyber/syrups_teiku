// Рулетка с сиропами
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загрузилась!');
    
    // НАСТРОЙКИ - 10 секторов
    const segments = Array(10).fill().map((_, i) => 'Сектор ' + (i + 1));
    
    const colors = [
        '#F2DBE3', '#FAEDCD', '#F2DBE3', '#FAEDCD', 
        '#F2DBE3', '#FAEDCD', '#F2DBE3', '#FAEDCD', 
        '#F2DBE3', '#FAEDCD'
    ];
    
    // ПУТИ К КАРТИНКАМ НА СЕКТОРАХ (10 штук)
    const sectorImages = [
        'img/pic_1.png', 'img/pic_2.png', 'img/pic_3.png', 'img/pic_4.png',
        'img/pic_5.png', 'img/pic_6.png', 'img/pic_7.png', 'img/pic_8.png',
        'img/pic_9.png', 'img/pic_10.png'
    ];
    
    // ВАШИ 18 КОМБИНАЦИЙ СИРОПОВ
    const syrupPrizes = [
        { name: "Грушевый пирог", syrups: ["Груша", "Сливочный ирис", "Ваниль"] },
        { name: "Тропический десерт", syrups: ["Кокос", "Маракуйя", "Сгущённое молоко"] },
        { name: "Ягодный чизкейк", syrups: ["Клубника-земляника", "Сливочный ирис", "Ваниль"] },
        { name: "Таёжный", syrups: ["Ягоды тундры", "Фундук", "Карамель"] },
        { name: "Лавандовый десерт", syrups: ["Лаванда", "Сгущённое молоко", "Ваниль"] },
        { name: "Французская кондитерская", syrups: ["Миндаль", "Вишня", "Шоколадный трюфель"] },
        { name: "Пряный манго", syrups: ["Манго", "Восточные пряности", "Ваниль"] },
        { name: "Фисташковый чизкейк", syrups: ["Фисташка", "Малина", "Сливочный ирис"] },
        { name: "Японский десерт", syrups: ["Личи", "Кокос", "Ваниль"] },
        { name: "Карамельный попкорн", syrups: ["Попкорн", "Солёная карамель", "Ваниль"] },
        { name: "Тропический чизкейк", syrups: ["Ананас", "Кокос", "Сгущённое молоко"] },
        { name: "Северная ягода", syrups: ["Чёрная смородина", "Ваниль", "Карамель"] },
        { name: "Фруктовый марципан", syrups: ["Персик", "Миндаль", "Ваниль"] },
        { name: "Малиновый трюфель", syrups: ["Малина", "Шоколадный трюфель", "Сливочный ирис"] },
        { name: "Пряная груша", syrups: ["Груша", "Имбирный пряник", "Карамель"] },
        { name: "Фейхоа крем", syrups: ["Фейхоа", "Ваниль", "Сгущённое молоко"] },
        { name: "Малина-кокос латте", syrups: ["Малина-кокос", "Ваниль", "Сливочный ирис"] },
        { name: "Ореховый десерт", syrups: ["Макадамия", "Солёная карамель", "Ваниль"] }
    ];
    
    // Элементы
    const canvas = document.getElementById('wheel');
    const spinBtn = document.getElementById('spinBtn');
    const resultDiv = document.getElementById('result');
    
    // Проверяем, что canvas существует
    if (!canvas) {
        console.error('Canvas не найден!');
        return;
    }
    
    // Устанавливаем размеры canvas
    const size = Math.min(window.innerWidth * 0.8, 400);
    canvas.width = size;
    canvas.height = size;
    
    let rotation = 0;
    let spinning = false;
    
    // Звуки (если папка sounds есть)
    let spinAudio = null;
    let stopAudio = null;
    
    function initSounds() {
        try {
            spinAudio = new Audio('sounds/spin.mp3');
            spinAudio.loop = true;
            spinAudio.volume = 0.2;
        } catch(e) { console.log('Звук вращения не загружен'); }
        
        try {
            stopAudio = new Audio('sounds/stop.mp3');
            stopAudio.volume = 0.3;
        } catch(e) { console.log('Звук остановки не загружен'); }
    }
    
    // Загружаем картинки для секторов
    const sectorImagesList = [];
    for (let i = 0; i < sectorImages.length; i++) {
        const img = new Image();
        img.src = sectorImages[i];
        sectorImagesList.push(img);
    }
    
    // Функция для преобразования названия сиропа в имя файла
    function getSyrupImageName(syrupName) {
        return syrupName
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[()]/g, '')
            .replace(/-/g, '_')
            .replace(/[^a-zа-я0-9_]/g, '')
            + '.png';
    }
    
    // Функция для создания попапа
    function showSyrupPopup(prize) {
        console.log('Показываем попап для:', prize.name);
        
        const oldPopup = document.getElementById('syrupPopup');
        if (oldPopup) oldPopup.remove();
        
        const popup = document.createElement('div');
        popup.id = 'syrupPopup';
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            text-align: center;
            z-index: 1000;
            min-width: 280px;
            max-width: 90%;
            width: auto;
            border: 3px solid #ff99cc;
        `;
        
        let syrupsHtml = '<div style="display: flex; justify-content: center; gap: 15px; margin: 15px 0; flex-wrap: wrap;">';
        
        for (let i = 0; i < prize.syrups.length; i++) {
            const syrup = prize.syrups[i];
            const imageName = getSyrupImageName(syrup);
            
            syrupsHtml += `
                <div style="text-align: center; width: 80px;">
                    <img src="syrup_images/${imageName}" alt="${syrup}" 
                         style="width: 60px; height: 60px; object-fit: contain; border-radius: 12px; background: #f8f8f8; padding: 5px;"
                         onerror="this.style.display='none'; this.parentElement.querySelector('.syrup-name').style.marginTop = '0';">
                    <div class="syrup-name" style="font-size: 11px; font-weight: bold; color: #666; margin-top: 5px;">${syrup}</div>
                </div>
            `;
        }
        
        syrupsHtml += '</div>';
        
        popup.innerHTML = `
            <h3 style="margin: 0 0 5px 0; color: #ff3399;">🎉 Ваша комбинация! 🎉</h3>
            <h2 style="font-size: 18px; margin: 10px 0; color: #333;">${prize.name}</h2>
            ${syrupsHtml}
            <button id="closePopupBtn" style="
                background: linear-gradient(135deg, #ff99cc 0%, #ff66b2 100%);
                color: white;
                border: none;
                padding: 10px 25px;
                font-size: 16px;
                border-radius: 50px;
                cursor: pointer;
                font-weight: bold;
                margin-top: 10px;
            ">ЗАКРЫТЬ</button>
        `;
        
        document.body.appendChild(popup);
        
        document.getElementById('closePopupBtn').onclick = function() {
            popup.remove();
        };
        
        popup.addEventListener('click', function(e) {
            if (e.target === popup) popup.remove();
        });
    }
    
    // Функция рисования
    function draw() {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2 - 10;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const anglePerSegment = (Math.PI * 2) / segments.length;
        
        // Рисуем сектора
        for (let i = 0; i < segments.length; i++) {
            const startAngle = i * anglePerSegment + rotation;
            const endAngle = (i + 1) * anglePerSegment + rotation;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Рисуем картинки
        for (let i = 0; i < segments.length; i++) {
            const startAngle = i * anglePerSegment + rotation;
            
            if (sectorImagesList[i] && sectorImagesList[i].complete && sectorImagesList[i].src) {
                try {
                    ctx.save();
                    const imgX = centerX + Math.cos(startAngle + anglePerSegment/2) * (radius * 0.6);
                    const imgY = centerY + Math.sin(startAngle + anglePerSegment/2) * (radius * 0.6);
                    ctx.translate(imgX, imgY);
                    ctx.rotate(startAngle + anglePerSegment/2 + Math.PI/2);
                    ctx.drawImage(sectorImagesList[i], -25, -25, 50, 50);
                    ctx.restore();
                } catch(e) {}
            }
        }
        
        // Центр колеса
        ctx.beginPath();
        ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
        ctx.fillStyle = '#E8D1D9';
        ctx.fill();
        ctx.strokeStyle = '#F0E3C3';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // Функция вращения
    function spin() {
        if (spinning) return;
        
        spinning = true;
        spinBtn.disabled = true;
        resultDiv.textContent = 'Крутится...';
        
        if (spinAudio) {
            spinAudio.currentTime = 0;
            spinAudio.play().catch(e => {});
        }
        
        const randomRotations = 8 + Math.floor(Math.random() * 5);
        const fullRotations = randomRotations * Math.PI * 2;
        const randomStopAngle = Math.random() * Math.PI * 2;
        
        const startRotation = rotation;
        const startNormalized = ((startRotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        
        let delta = randomStopAngle - startNormalized;
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;
        
        const targetRotation = startRotation + fullRotations + delta;
        const startTime = Date.now();
        const duration = 7000;
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            rotation = startRotation + (targetRotation - startRotation) * easeOut;
            draw();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                spinning = false;
                spinBtn.disabled = false;
                
                if (spinAudio) {
                    spinAudio.pause();
                    spinAudio.currentTime = 0;
                }
                
                if (stopAudio) {
                    stopAudio.currentTime = 0;
                    stopAudio.play().catch(e => {});
                }
                
                const randomIndex = Math.floor(Math.random() * syrupPrizes.length);
                const prize = syrupPrizes[randomIndex];
                
                resultDiv.textContent = '🍹 ' + prize.name;
                showSyrupPopup(prize);
                
                console.log('Выигрыш:', prize.name);
            }
        }
        
        animate();
    }
    
    // Инициализация
    function init() {
        draw();
        initSounds();
        spinBtn.onclick = spin;
        
        // Telegram
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }
        
        // Адаптация при изменении размера
        window.addEventListener('resize', function() {
            const newSize = Math.min(window.innerWidth * 0.8, 400);
            canvas.width = newSize;
            canvas.height = newSize;
            draw();
        });
    }
    
    init();
    console.log('Рулетка готова!');
});
