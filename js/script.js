//бургер 
const burgerBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');

if (burgerBtn && nav) {
    burgerBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// тпереключение тем
const root = document.documentElement;
const themeIcon = document.getElementById('themeIcon');
const moon = 'img/moon1.svg';
const sunny = 'img/sunny2.svg';

function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    if (themeIcon) {
        themeIcon.src = theme === 'dark' ? sunny : moon;
    }
}
setTheme(localStorage.getItem('theme') || 'light');

document.getElementById('themeToggle')?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

// подключения карты через api
if (document.getElementById('yandex-map')) {
    ymaps.ready(function () {
        var coords = [53.719708, 91.467298];
        var myMap = new ymaps.Map("yandex-map", {
            center: coords,
            zoom: 17,
            controls: ['zoomControl', 'fullscreenControl']
        });
        var placemark = new ymaps.Placemark(coords, {
            hintContent: 'ЦЦО «IT-куб»',
        }, { preset: 'islands#redEducationIcon' });
        myMap.geoObjects.add(placemark);
        ymaps.geocode("Абакан, улица Пушкина, 30", { results: 1 }).then(function (res) {
            var foundCoords = res.geoObjects.get(0).geometry.getCoordinates();
            myMap.setCenter(foundCoords, 17);
        });
    });
}

// валидация формы отправки
const regForm = document.getElementById('regForm');
if (regForm) {
    regForm.addEventListener('submit', function (e) {
        e.preventDefault();

        document.querySelectorAll('.error-text').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.input-field').forEach(el => el.classList.remove('error'));

        let valid = true;

        const name = document.getElementById('name');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');
        const checkbox1 = document.getElementById('checkbox1');
        const checkbox2 = document.getElementById('checkbox2');

        if (name.value.trim() === '') {
            document.getElementById('errName').style.display = 'block';
            name.classList.add('error');
            valid = false;
        }

        if (phone.value.replace(/\D/g, '').length < 10) {
            document.getElementById('errPhone').style.display = 'block';
            phone.classList.add('error');
            valid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            document.getElementById('errEmail').style.display = 'block';
            email.classList.add('error');
            valid = false;
        }

        if (!checkbox1.checked) {
            document.getElementById('errcheckbox1').style.display = 'block';
            valid = false;
        }

        if (!checkbox2.checked) {
            document.getElementById('errcheckbox2').style.display = 'block';
            valid = false;
        }

        if (valid) {
            console.log('Данные отправлены');
            document.getElementById('formView').style.display = 'none';
            document.getElementById('successView').style.display = 'block';
        }
    });
}

//админ-панель
if (document.getElementById('applicationsTable')) {

    const dataArray = [
        { id: 1, fullname: 'Екатерина', phone: '+7 (963) 123-45-67', email: 'vvanova@gmail.com', directionName: 'Программирование на Python', date: '15.04.2026, 14:30', status: 'new' },
        { id: 2, fullname: 'Мария', phone: '+7 (976) 234-56-78', email: 'petrova@yandex.ru', directionName: 'Дизайн и Frontend разработка', date: '14.04.2026, 10:15', status: 'confirmed' },
        { id: 3, fullname: 'Богдан', phone: '+7 (996) 345-67-89', email: 'dorov@gmail.com', directionName: 'Программирование роботов', date: '13.04.2026, 09:00', status: 'new' },
        { id: 4, fullname: 'Анна', phone: '+7 (951) 456-78-90', email: 'kuznetsova@gmail.com', directionName: 'Разработка VR/AR-приложений', date: '12.04.2026, 16:20', status: 'rejected' },
        { id: 5, fullname: 'Артем', phone: '+7 (923) 567-89-01', email: 'mikhailov@yandex.ru', directionName: 'Системное администрирование', date: '11.04.2026, 11:45', status: 'confirmed' },
        { id: 6, fullname: 'Александр', phone: '+7 (919) 678-90-12', email: 'smirnov@gmail.com', directionName: 'Программирование на Java', date: '10.04.2026, 13:30', status: 'confirmed' }
    ];
    let applications = [...dataArray];

    function updateStats() {
        document.getElementById('totalCount').innerText = applications.length;
        document.getElementById('newCount').innerText = applications.filter(a => a.status === 'new').length;
        document.getElementById('confirmedCount').innerText = applications.filter(a => a.status === 'confirmed').length;
        document.getElementById('rejectedCount').innerText = applications.filter(a => a.status === 'rejected').length;
    }

    function changeStatus(id, newStatus) {
        const app = applications.find(a => a.id === id);
        if (app && app.status === 'new') {
            app.status = newStatus;
            updateStats();
            renderApplications();
        }
    }

    function renderApplications() {
        const filter = document.getElementById('statusFilter').value;
        let filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);
        const tbody = document.getElementById('applicationsTable');
        if (!tbody) return;
        tbody.innerHTML = filtered.map(app => {
            let btns = '';
            if (app.status === 'new') {
                btns = `<button class="btn-icon confirm" onclick="changeStatus(${app.id}, 'confirmed')">✔</button>
                        <button class="btn-icon delete" onclick="changeStatus(${app.id}, 'rejected')">✖</button>`;
            } else {
                btns = '—';
            }
            const statusText = { 'new': 'Новая', 'confirmed': 'Подтверждена', 'rejected': 'Отклонена' }[app.status];
            return `<tr>
                <td>${app.id}</td>
                <td>${app.fullname}</td>
                <td>${app.phone}</td>
                <td>${app.email}</td>
                <td>${app.directionName}</td>
                <td>${app.date}</td>
                <td><span class="status-badge status-${app.status}">${statusText}</span></td>
                <td class="action-btns">${btns}</td>
            </tr>`;
        }).join('');
    }

    document.getElementById('statusFilter').addEventListener('change', renderApplications);
    updateStats();
    renderApplications();
}

// валидация формы входа
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var login = document.getElementById('login').value;
    var password = document.getElementById('password').value;
    var errorText = document.getElementById('errorText');
    var loginField = document.getElementById('login');
    var passwordField = document.getElementById('password');

    errorText.style.display = 'none';
    loginField.classList.remove('error');
    passwordField.classList.remove('error');

    if (login === 'admin' && password === '123') {
        window.location.href = 'admin.html';
    } if (login === 'user' && password === '123') {
        window.location.href = 'profile.html';
    } else {
        errorText.style.display = 'block';
        loginField.classList.add('error');
        passwordField.classList.add('error');
    }
});

