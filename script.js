// Рулетка с сиропами
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загрузилась!');
    
    // НАСТРОЙКИ - 10 секторов
    const segments = [
        'Сектор 1', 'Сектор 2', 'Сектор 3', 'Сектор 4', 'Сектор 5',
        'Сектор 6', 'Сектор 7', 'Сектор 8', 'Сектор 9', 'Сектор 10'
    ];
    
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
    
    // === ВАШИ 18 КОМБИНАЦИЙ СИРОПОВ ===
    const syrupPrizes = [
        {
            name: "Грушевый пирог",
            syrups: ["Груша", "Сливочный ирис", "Ваниль"]
        },
        {
            name: "Тропический десерт",
            syrups: ["Кокос", "Маракуйя", "Сгущённое молоко"]
        },
        {
            name: "Ягодный чизкейк",
            syrups: ["Клубника-земляника", "Сливочный ирис", "Ваниль"]
        },
        {
            name: "Таёжный",
            syrups: ["Ягоды тундры", "Фундук", "Карамель"]
        },
        {
            name: "Лавандовый десерт",
            syrups: ["Лаванда", "Сгущённое молоко", "Ваниль"]
        },
        {
            name: "Французская кондитерская",
            syrups: ["Миндаль", "Вишня", "Шоколадный трюфель"]
        },
        {
            name: "Пряный манго",
            syrups: ["Манго", "Восточные пряности", "Ваниль"]
        },
        {
            name: "Фисташковый чизкейк",
            syrups: ["Фисташка", "Малина", "Сливочный ирис"]
        },
        {
            name: "Японский десерт",
            syrups: ["Личи", "Кокос", "Ваниль"]
        },
        {
            name: "Карамельный попкорн",
            syrups: ["Попкорн", "Солёная карамель", "Ваниль"]
        },
        {
            name: "Тропический чизкейк",
            syrups: ["Ананас", "Кокос", "Сгущённое молоко"]
        },
        {
            name: "Северная ягода",
            syrups: ["Чёрная смородина", "Ваниль", "Карамель"]
        },
        {
            name: "Фруктовый марципан",
            syrups: ["Персик", "Миндаль", "Ваниль"]
        },
        {
            name: "Малиновый трюфель",
            syrups: ["Малина", "Шоколадный трюфель", "Сливочный ирис"]
        },
        {
            name: "Пряная груша",
            syrups: ["Груша", "Имбирный пряник", "Карамель"]
        },
        {
            name: "Фейхоа крем",
            syrups: ["Фейхоа", "Ваниль", "Сгущённое молоко"]
        },
        {
            name: "Малина-кокос латте",
            syrups: ["Малина-кокос", "Ваниль", "Сливочный ирис"]
        },
        {
            name: "Ореховый десерт",
            syrups: ["Макадамия", "Солёная карамель", "Ваниль"]
        }
    ];
    
    // Элементы
    const canvas = document.getElementById('wheel');
    const spinBtn = document.getElementById('spinBtn');
    const resultDiv = document.getElementById('result');
    
    let rotation = 0;
    let spinning = false;
    
    // === ЗВУКОВЫЕ ЭФФЕКТЫ ===
    let spinSoundObj = null;
    let playStopSound = null;
    let soundEnabled = true;
    
    // ЗВУК ВРАЩЕНИЯ ИЗ MP3 ФАЙЛА
    function createSpinSound() {
        if (!soundEnabled) return null;
        
        try {
            const audio = new Audio();
            audio.src = 'sounds/spin.mp3';
            audio.loop = true;
            audio.volume = 0.2;
            
            return {
                start: function() {
                    audio.play().catch(e => console.log('Ошибка воспроизведения MP3:', e));
                },
                stop: function() {
                    audio.pause();
                    audio.currentTime = 0;
                }
            };
        } catch (e) {
            console.log('Ошибка загрузки MP3:', e);
            return null;
        }
    }
    
    // ЗВУК ОСТАНОВКИ
    function createStopSound() {
        if (!soundEnabled) return null;
        
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContext();
            
            return function() {
                const now = audioCtx.currentTime;
                const oscillator = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                oscillator.connect(gain);
                gain.connect(audioCtx.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.value = 880;
                
                gain.gain.value = 0;
                gain.gain.exponentialRampToValueAtTime(0.4, now + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
                
                oscillator.start();
                oscillator.stop(now + 0.5);
                
                if (audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }
            };
        } catch (e) {
            console.log('Ошибка инициализации звука остановки:', e);
            return null;
        }
    }
    
    // Инициализация звуков
    function initSounds() {
        spinSoundObj = createSpinSound();
        playStopSound = createStopSound();
        console.log('Звуки инициализированы');
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
    
    // Функция для создания попапа с тремя сиропами
    function showSyrupPopup(prize) {
        console.log('=== ПОКАЗЫВАЕМ ПОПАП ДЛЯ ===', prize.name);
        
        // Удаляем старый попап
        const oldPopup = document.getElementById('syrupPopup');
        if (oldPopup) oldPopup.remove();
        
        // Создаём новый попап
        const popup = document.createElement('div');
        popup.id = 'syrupPopup';
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 25px;
            border-radius: 20px;
            box-shadow: 0 15px 50px rgba(0,0,0,0.3);
            text-align: center;
            z-index: 1000;
            min-width: 320px;
            max-width: 400px;
            border: 4px solid #ff99cc;
            animation: popupFadeIn 0.3s ease-out;
        `;
        
        // Создаём HTML для трёх сиропов
        let syrupsHtml = '<div style="display: flex; justify-content: center; gap: 15px; margin: 20px 0; flex-wrap: wrap;">';
        
        for (let i = 0; i < prize.syrups.length; i++) {
            const syrup = prize.syrups[i];
            const imageName = getSyrupImageName(syrup);
            
            syrupsHtml += `
                <div style="text-align: center; width: 90px;">
                    <img src="syrup_images/${imageName}" alt="${syrup}" 
                         style="width: 70px; height: 70px; object-fit: contain; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-bottom: 8px;"
                         onerror="this.style.display='none'; this.parentElement.innerHTML += '<div style=\\'font-size: 12px; color: #999;\\'>${syrup}</div>';">
                    <div style="font-size: 12px; font-weight: bold; color: #666;">${syrup}</div>
                </div>
            `;
        }
        
        syrupsHtml += '</div>';
        
        popup.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 10px; color: #ff3399;">🎉 Ваша комбинация! 🎉</h3>
            <h2 style="font-size: 22px; margin: 10px 0; color: #333;">${prize.name}</h2>
            ${syrupsHtml}
            <button id="closePopupBtn" style="
                background: linear-gradient(135deg, #ff99cc 0%, #ff66b2 100%);
                color: white;
                border: none;
                padding: 12px 30px;
                font-size: 18px;
                border-radius: 50px;
                cursor: pointer;
                font-weight: bold;
                margin-top: 15px;
                box-shadow: 0 5px 15px rgba(255,102,178,0.3);
            ">ЗАКРЫТЬ</button>
        `;
        
        document.body.appendChild(popup);
        
        // Добавляем анимацию
        const style = document.createElement('style');
        style.textContent = `
            @keyframes popupFadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -30%);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Кнопка закрытия
        document.getElementById('closePopupBtn').onclick = function() {
            popup.remove();
        };
        
        // Закрытие по клику вне попапа
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                popup.remove();
            }
        });
    }
    
    // Функция рисования
    function draw() {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 200;
        
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
            ctx.fillStyle = colors[i];
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Рисуем картинки поверх секторов
        for (let i = 0; i < segments.length; i++) {
            const startAngle = i * anglePerSegment + rotation;
            
            if (sectorImagesList[i] && sectorImagesList[i].complete) {
                try {
                    ctx.save();
                    const imgX = centerX + Math.cos(startAngle + anglePerSegment/2) * 120;
                    const imgY = centerY + Math.sin(startAngle + anglePerSegment/2) * 120;
                    ctx.translate(imgX, imgY);
                    ctx.rotate(startAngle + anglePerSegment/2 + Math.PI/2);
                    ctx.drawImage(sectorImagesList[i], -30, -30, 60, 60);
                    ctx.restore();
                } catch (e) {
                    console.log('Ошибка картинки', i);
                }
            }
        }
        
        // Рисуем центр колеса
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#E8D1D9';
        ctx.fill();
        ctx.strokeStyle = '#F0E3C3';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // Функция вращения
    function spin() {
        console.log('Кнопка нажата!');
        
        if (spinning) return;
        
        spinning = true;
        spinBtn.disabled = true;
        resultDiv.textContent = 'Крутится...';
        
        // ВКЛЮЧАЕМ ЗВУК ВРАЩЕНИЯ
        if (spinSoundObj) {
            spinSoundObj.start();
        }
        
        const randomStopAngle = Math.random() * Math.PI * 2;
        const randomRotations = 8 + Math.floor(Math.random() * 5);
        const fullRotations = randomRotations * Math.PI * 2;
        
        const startRotation = rotation;
        const startNormalized = ((startRotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        
        let delta = randomStopAngle - startNormalized;
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;
        
        const targetRotation = startRotation + fullRotations + delta;
        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / 7000, 1);
            
            rotation = startRotation + (targetRotation - startRotation) * (1 - Math.pow(1 - progress, 3));
            draw();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                spinning = false;
                spinBtn.disabled = false;
                
                // ВЫКЛЮЧАЕМ ЗВУК ВРАЩЕНИЯ
                if (spinSoundObj) {
                    spinSoundObj.stop();
                }
                
                // ВКЛЮЧАЕМ ЗВУК ОСТАНОВКИ
                if (playStopSound) {
                    playStopSound();
                }
                
                // ВЫБИРАЕМ СЛУЧАЙНУЮ КОМБИНАЦИЮ
                const randomIndex = Math.floor(Math.random() * syrupPrizes.length);
                const prize = syrupPrizes[randomIndex];
                
                resultDiv.textContent = 'Выигрыш: ' + prize.name;
                
                // ПОКАЗЫВАЕМ ПОПАП С ТРЕМЯ СИРОПАМИ
                showSyrupPopup(prize);
                
                console.log('Результат:', prize.name);
            }
        }
        
        animate();
    }
    
    // Начальное рисование
    draw();
    
    // Инициализируем звуки
    initSounds();
    
    // Привязываем кнопку
    spinBtn.onclick = spin;
    
    // Инициализация Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        
        setTimeout(function() {
            draw();
            console.log('Принудительная перерисовка для Telegram');
        }, 100);
        
        window.Telegram.WebApp.onEvent('themeChanged', function() {
            draw();
            console.log('Перерисовка после смены темы');
        });
    }
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            draw();
            console.log('Перерисовка после полной загрузки');
        }, 200);
    });
    
    console.log('Готово!');
});