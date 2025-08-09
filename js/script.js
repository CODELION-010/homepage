particlesJS("particles-js", {
    "particles": {
        "number": { "value": 200 },
        "size": { "value": 3 },
        "move": { "speed": 2 },
        "line_linked": { "enable": true },
        "color": { "value": "#ffffff" }
    }
});

// Sistema de Cambio de Temas
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeMenu = document.getElementById('theme-menu');
    const themeOptions = document.querySelectorAll('.theme-option');
    const body = document.body;

    // Cargar tema guardado
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    body.className = `theme-${savedTheme}`;

    // Toggle del menú de temas
    themeToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        themeMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function() {
        themeMenu.classList.remove('active');
    });

    // Prevenir cierre del menú al hacer clic dentro
    themeMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Cambiar tema
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedTheme = this.getAttribute('data-theme');
            
            // Remover clases de tema existentes
            body.className = body.className.replace(/theme-\w+/g, '');
            
            // Agregar nueva clase de tema
            body.classList.add(`theme-${selectedTheme}`);
            
            // Guardar tema seleccionado
            localStorage.setItem('selectedTheme', selectedTheme);
            
            // Cerrar menú
            themeMenu.classList.remove('active');
            
            // Actualizar partículas según el tema
            updateParticles(selectedTheme);
            
            // Mostrar notificación
            showThemeNotification(selectedTheme);
        });
    });

    // Actualizar configuración de partículas según el tema
    function updateParticles(theme) {
        let particleColor = "#ffffff";
        let particleCount = 200;
        
        if (theme === 'image') {
            particleColor = "#ffffff";
            particleCount = 150; // Menos partículas para no sobrecargar la imagen
        }
        
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": particleCount },
                "size": { "value": 3 },
                "move": { "speed": 2 },
                "line_linked": { 
                    "enable": true,
                    "color": particleColor,
                    "opacity": theme === 'image' ? 0.3 : 0.4
                },
                "color": { "value": particleColor },
                "opacity": {
                    "value": theme === 'image' ? 0.5 : 0.8
                }
            }
        });
    }

    // Mostrar notificación de cambio de tema
    function showThemeNotification(theme) {
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        
        const themeNames = {
            'default': 'Tema Principal',
            'image': 'Tema con Imagen'
        };
        
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${themeNames[theme]} activado
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            z-index: 9999;
            opacity: 0;
            transition: all 0.3s ease;
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(10px)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-10px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // Inicializar partículas con el tema guardado
    updateParticles(savedTheme);
});