function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setWallpaper() {
    const wallpaperName = getCookie("wallpaper") || "sequoia-light";
    document.body.style.backgroundImage = `url('extra/wallpapers/${wallpaperName}.jpg')`;
}





function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 200);
}

window.onload = function() {
    updateProgressBar();
    setTimeout(() => {
        document.getElementById('preloader').style.display = 'none';
        document.querySelector('#menubar').classList.add("menu-anim")
        document.getElementById('dock').classList.add("dock-anim")

        const password = getCookie('password');
        if (password) {
            document.getElementById('content').style.display = 'block';
        } else {
            document.getElementById('lockscreen').style.display = 'flex';
            document.getElementById('lockscreen').style.opacity = '1';
            updateTime();
            setInterval(updateTime, 1000);
        }
    }, 2000);

    // Обработчик клика по #launchpad
    document.getElementById('launchpad').addEventListener('click', (e) => {
        // Проверяем, что было нажато внутри #launchpad
        const target = e.target;
    
        if (target.classList.contains('launchpad-app')) {
            // Если кликнули по иконке приложения в #launchpad
            const appName = target.querySelector('.app-name').innerText;
            console.log(`Running app: ${appName}`);
        } else if (target.id === 'launchpad') {
            // Если кликнули по пустой области #launchpad
            // Добавляем класс 'launchpadClose' для запуска анимации закрытия
            document.getElementById('launchpad').classList.add('launchpadClose');
    
            // Убираем класс 'launchpadClose' и скрываем launchpad через 500 мс (длительность анимации)
            setTimeout(() => {
                document.getElementById('launchpad').classList.remove('launchpadClose');
                document.getElementById('launchpad').style.display = 'none'; // Закрываем launchpad
            }, 500);
        }
    });

    // Добавляем EventListener для каждого элемента .launchpad-app в #launchpad
    const launchpadApps = document.querySelectorAll('.launchpad-app');
    launchpadApps.forEach(launchpadApp => {
        launchpadApp.addEventListener('click', () => {
            document.getElementById('launchpad').style.display = 'none'; // Закрываем launchpad
            const appName = launchpadApp.querySelector('.app-name').innerText;
            console.log(`Running app: ${appName}`);
            const appUrl = launchpadApp.querySelector('.app-logo').getAttribute('data-url');
            createWindow(`./apps/${appName.toLowerCase().trim()}.html`, 800, 600, appName);
        });
    });

}

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('app-search');
    const apps = document.querySelectorAll('.launchpad-app');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();

        apps.forEach(function(app) {
            const appName = app.getAttribute('data-app-name').toLowerCase();
            if (appName.includes(searchTerm)) {
                app.style.display = 'block';
            } else {
                app.style.display = 'none';
            }
        });
    });
});


const apps = document.querySelectorAll('.app');
const focusedAppElement = document.getElementById('focused-app');
let zIndex = 1;

apps.forEach(app => {
    app.addEventListener('click', () => {
        const url = app.getAttribute('data-url');
        const width = app.getAttribute('data-width') || 800;
        const height = app.getAttribute('data-height') || 600;
        const appName = app.getAttribute('alt');
        const minimize = app.getAttribute('minimize');
        const maximize = app.getAttribute('maximize');
        const blurred = app.getAttribute('blurred');
        const custom = app.getAttribute('custom');
        let buttons = [];

        // Check for minimize and maximize attributes
        if (minimize === "yes") {
            buttons.push("minimize");
        }
        if (maximize === "yes") {
            buttons.push("maximize");
        }
        // Close button is always included
        buttons.push("close");

        console.log(buttons);
        createWindow(url, width, height, appName, custom, buttons, blurred);
    });
});

function createWindow(url, width = 800, height = 600, appName = 'Application', custom, interactions = [], blurred = "yes") {
    parameters = [url, width, height, appName, custom, interactions, blurred];
    console.log("attempting to create window with parameters: " + parameters);
    console.log(interactions);

    if (url === "launchpad") {
        const launchpad = document.getElementById('launchpad');
        launchpad.style.display = 'block'; // Show launchpad
        launchpad.classList.add('launchpadOpen');

        // Remove 'launchpadOpen' class after 500 ms (duration of the animation)
        setTimeout(() => {
            launchpad.classList.remove('launchpadOpen');
        }, 500);
    } else {
        const windowDiv = document.createElement('div');
        windowDiv.classList.add('window');
        windowDiv.style.width = width + 'px';
        windowDiv.style.height = height + 'px';
        windowDiv.style.zIndex = zIndex++;
        windowDiv.style.minWidth = width + "px";
        windowDiv.style.minHeight = height + "px";

        // Calculate position to center the window
        const left = Math.max(0, (window.innerWidth - width) / 2);
        const top = Math.max(0, (window.innerHeight - height) / 2);
        windowDiv.style.left = left + 'px';
        windowDiv.style.top = top + 'px';

        const header = document.createElement('div');
        header.classList.add('window-header');

        const controls = document.createElement('div');
        controls.classList.add('window-controls');

        const createButton = (type, color) => {
            const button = document.createElement('div');
            button.classList.add('window-button', type);
            if (interactions.includes(type)) {
                button.style.backgroundColor = color;
            } else {
                button.style.backgroundColor = 'grey';
            }
            return button;
        };

        const closeButton = createButton('close', '#ff5f56');
        closeButton.onclick = () => {
            windowDiv.classList.add('closing');
            setTimeout(() => {
                windowDiv.remove();
                focusedAppElement.innerText = "Рабочий стол";
            }, 300);
        };
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.backgroundColor = '#ff5f56';
        });
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.backgroundColor = interactions.includes("close") ? '#ff5f56' : 'grey';
        });
        controls.appendChild(closeButton);

        const minimizeButton = createButton('minimize', '#ffbd2e');
        if (interactions.includes("minimize")) {
            minimizeButton.onclick = () => {
                windowDiv.style.display = 'none';
                // Add additional logic to restore the window
            };
            minimizeButton.addEventListener('mouseenter', () => {
                minimizeButton.style.backgroundColor = '#ffbd2e';
            });
            minimizeButton.addEventListener('mouseleave', () => {
                minimizeButton.style.backgroundColor = interactions.includes("minimize") ? '#ffbd2e' : 'grey';
            });
        }
        controls.appendChild(minimizeButton);

        const maximizeButton = createButton('maximize', '#27c93f');
        if (interactions.includes("maximize")) {
            maximizeButton.onclick = () => {
                if (windowDiv.classList.contains('maximized')) {
                    // Restore original size
                    windowDiv.style.width = width + 'px';
                    windowDiv.style.height = height + 'px';
                    const left = Math.max(0, (window.innerWidth - width) / 2);
                    const top = Math.max(0, (window.innerHeight - height) / 2);
                    windowDiv.style.left = left + 'px';
                    windowDiv.style.top = top + 'px';
                    windowDiv.classList.remove('maximized');
                } else {
                    // Maximize window
                    const menubarHeight = document.getElementById('menubar').offsetHeight;
                    const dockHeight = document.getElementById('dock').offsetHeight;
                    const maxWidth = window.innerWidth - 20; // 10px padding on each side
                    const maxHeight = window.innerHeight - menubarHeight - dockHeight - 35; // 10px padding on top and bottom

                    windowDiv.style.width = maxWidth + 'px';
                    windowDiv.style.height = maxHeight + 'px';
                    windowDiv.style.top = (menubarHeight + 10) + 'px';
                    windowDiv.style.left = '10px';
                    windowDiv.classList.add('maximized');
                }
            };
            maximizeButton.addEventListener('mouseenter', () => {
                maximizeButton.style.backgroundColor = '#27c93f';
            });
            maximizeButton.addEventListener('mouseleave', () => {
                maximizeButton.style.backgroundColor = interactions.includes("maximize") ? '#27c93f' : 'grey';
            });
        }
        controls.appendChild(maximizeButton);

        header.appendChild(controls);

        if (custom === "yes") {
            console.log("это кастом окно");
            header.style.background = 'transparent';
        }

        // Create container for title
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('window-title-container');

        // Create element for window title
        const title = document.createElement('p');
        title.classList.add('window-title');
        title.innerText = appName;

        titleContainer.appendChild(title);
        header.appendChild(titleContainer);

        windowDiv.appendChild(header);

        if (custom === "yes") {
            title.style.display = 'none';
        }

        const content = document.createElement('div');
        content.classList.add('window-content');
        const iframe = document.createElement('object');
        iframe.data = url;
        iframe.scrolling = false;
        iframe.width = 100 + "%";
        iframe.height = 98 + "%";
        iframe.classList.add("sdkView");
        content.appendChild(iframe);
        windowDiv.appendChild(content);

        const resizer = document.createElement('div');
        resizer.classList.add('resizer');
        windowDiv.appendChild(resizer);

        document.body.appendChild(windowDiv);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                windowDiv.classList.add('active');
            });
        });

        // Update focused app in the menubar
        focusedAppElement.innerText = appName;

        // Set the new window as draggable and resizable
        makeDraggable(windowDiv, header);
        makeResizable(windowDiv);

        // Handler for setting z-index on window focus
        windowDiv.addEventListener('mousedown', () => {
            windowDiv.style.zIndex = zIndex++;
            focusedAppElement.innerText = appName;
        });

        return windowDiv;
    }
}


// Функция для добавления ошибки в контейнер
function displayError(message) {
    const errorContainer = document.getElementById('error-container');
    const errorParagraph = document.createElement('p');
    errorParagraph.textContent = message;
    errorContainer.appendChild(errorParagraph);
}

// Обработчик ошибок
window.onerror = function (message, source, lineno, colno, error) {
    const errorMessage = `Ошибка: ${message}\nИсточник: ${source}\nСтрока: ${lineno}, Столбец: ${colno}`;
    displayError(errorMessage);
    return false; // Вернуть true, чтобы предотвратить отображение ошибки в консоли по умолчанию
};




function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function makeResizable(element) {
    const resizer = element.querySelector('.resizer');
    resizer.addEventListener('mousedown', initResize, false);

    function initResize(e) {
        window.addEventListener('mousemove', Resize, false);
        window.addEventListener('mouseup', stopResize, false);
    }

    function Resize(e) {
        element.style.width = (e.clientX - element.offsetLeft) + 'px';
        element.style.height = (e.clientY - element.offsetTop) + 'px';
    }

    function stopResize(e) {
        window.removeEventListener('mousemove', Resize, false);
        window.removeEventListener('mouseup', stopResize, false);
    }
}

const baseWidth = 50;
const distanceLimit = baseWidth * 6;
const beyondTheDistanceLimit = distanceLimit + 1;
const distanceInput = [
    -distanceLimit,
    -distanceLimit / 1.25,
    -distanceLimit / 2,
    0,
    distanceLimit / 2,
    distanceLimit / 1.25,
    distanceLimit,
];
const widthOutput = [
    baseWidth,
    baseWidth * 1.1,
    baseWidth * 1.414,
    baseWidth * 2,
    baseWidth * 1.414,
    baseWidth * 1.1,
    baseWidth,
];

let mouseX = null;

const interpolate = (input, output) => {
    return (value) => {
    const length = input.length;
    for (let i = 0; i < length - 1; i++) {
        if (value >= input[i] && value <= input[i + 1]) {
        const t = (value - input[i]) / (input[i + 1] - input[i]);
        return output[i] * (1 - t) + output[i + 1] * t;
        }
    }
    return output[length - 1];
    };
};

const getWidthFromDistance = interpolate(distanceInput, widthOutput);

const dockElement = document.getElementById('dock');
const appElements = document.querySelectorAll('.app');

function updateAppSizes() {
    let totalWidth = 0;
    appElements.forEach(app => {
    const rect = app.getBoundingClientRect();
    const appCenterX = rect.left + rect.width / 2;
    const distance = mouseX !== null ? Math.abs(mouseX - appCenterX) : beyondTheDistanceLimit;
    const width = getWidthFromDistance(distance);
    app.style.width = `${width}px`;
    app.style.height = `${width}px`;
    totalWidth += width;
    });

    // Плавно изменяем ширину дока
    const padding = Math.max(0, (totalWidth - dockElement.offsetWidth) / 2);
    dockElement.style.paddingLeft = `20px ${padding}px`;
}

function animateDock() {
    updateAppSizes();
    requestAnimationFrame(animateDock);
}

dockElement.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
});

dockElement.addEventListener('mouseleave', () => {
    mouseX = null;
});
const dockType = getCookie('dockType');
if (dockType === "2"){
    animateDock();
}


// Dropdown menu functionality
let isMenuDropped = false;
let dropdown;

function selectDrop(itemId){
    isMenuDropped = false
    dropdown.remove();
    if (itemId === 1){
        createWindow("./apps/aboutmac.html", 500, 650, "Об этом Mac", true, interactions=["close"], true)
    }else if (itemId === 2){
        createWindow("./apps/settings.html", 800, 600, "Настройки", false, interactions=["close"], true)
    }else if (itemId === 5){
        createWindow("/apps/tweaks.html", 800, 600, "Конфигуратор системы", false, interactions=["close"], true)
    }else if (itemId === 6){
        window.location.reload()
    }
}   
function dropStatusMenu() {
    if (isMenuDropped === false) {
        isMenuDropped = true;
        dropdown = document.createElement("div");
        dropdown.innerHTML = `
            <div class="dropdown">
                <div class="dropdown-item" onclick="selectDrop(1)">
                    <div class="dropdown-item-text">
                        Об этом Mac
                    </div>
                </div>
                <div class="dropdown-item" onclick="selectDrop(2)">
                    <div class="dropdown-item-text">
                        Системные настройки
                    </div>
                </div>
                <div class="dropdown-item" onclick="selectDrop(3)">
                    <div class="dropdown-item-text">
                        Магазин приложений
                    </div>
                </div>
                <div class="dropdown-item" onclick="selectDrop(4)">
                    <div class="dropdown-item-text">
                        Выключение
                    </div>
                </div>
                <div class="dropdown-item" onclick="selectDrop(6)">
                    <div class="dropdown-item-text">
                        Перезагрузка
                    </div>
                </div>
                <div class="dropdown-item" onclick="selectDrop(5)">
                    <div class="dropdown-item-text">
                        Твики
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(dropdown);
    } else {
        isMenuDropped = false;
        if (dropdown) {
            dropdown.remove();
        }
    }
}

let isFocusMenuDropped = false;
let FocusMenu;
function dropFocusMenu() {
    if (isFocusMenuDropped === false) {
        isFocusMenuDropped = true;
        FocusMenu = document.createElement("div");
        FocusMenu.innerHTML = `
            <div class="dropdown">
                <div class="dropdown-item" onclick="selectDrop(1)">
                    <div class="dropdown-item-text">
                        Об этом Mac
                    </div>
                </div>
                <div class="dropdown-item" onclick="selectDrop(2)">
                    <div class="dropdown-item-text">
                        Системные настройки
                    </div>
                </div>
                <div class="dropdown-item" onclick="selectDrop(3)">
                    <div class="dropdown-item-text">
                        Магазин приложений
                    </div>
                </div>
                <div class="dropdown-item" onclick="selectDrop(4)">
                    <div class="dropdown-item-text">
                        Выключение
                    </div>
                </div>
                
            </div>
        `;
        document.body.appendChild(FocusMenu);
    } else {
        isFocusMenuDropped = false;
        if (FocusMenu) {
            FocusMenu.remove();
        }
    }
}


const screenWidth = window.screen.width;
const screenHeight = window.screen.height;

if (screenWidth < 860 && screenHeight < 790){
    const displaySupport = document.createElement("div");
    displaySupport.innerHTML=`
        <div class="rootMessage">
            <div class="messageInner">
                <h1>Измените разрешение экрана на более высокое</h1>
            </div>
        </div>
    `
    document.body.appendChild(displaySupport)
}

// Context menu functionality
const contextMenu = document.getElementById('context-menu');

window.addEventListener('contextmenu', (e) => {
    contextMenu.style.display = "block"
    e.preventDefault();
    const { clientX: mouseX, clientY: mouseY } = e;

    contextMenu.style.top = `${mouseY}px`;
    contextMenu.style.left = `${mouseX}px`;
    contextMenu.classList.add('active');
});

window.addEventListener('click', () => {
    contextMenu.classList.remove('active');
    setTimeout(contextMenu.style.display="none", 700)
    
});

function updateClock() {
    const now = new Date();
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    const timeString = `${day} ${date} ${month} ${hours}:${minutes}`;
    document.getElementById('clock').textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock(); // initial call to set clock immediately

const appsx = document.querySelectorAll('.app');

// Добавляем EventListener для каждого элемента
appsx.forEach(app => {
    app.addEventListener('click', () => {
        // Добавляем класс 'bounce' для запуска анимации
        app.classList.add('bounce');

        // Убираем класс 'bounce' через 500 мс (длительность анимации)
        setTimeout(() => {
            app.classList.remove('bounce');
        }, 1500);
    });
});
setInterval(setWallpaper, 1000)