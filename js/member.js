function toggleForm(action) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const emailVerify = document.getElementById('email-verify');

    if (action === 'showRegister') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        emailVerify.style.display = 'none';
    } else if (action === 'showLogin') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        emailVerify.style.display = 'none';
    } else if (action === 'showEmailVerify') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        emailVerify.style.display = 'block';
    }
};

function validateRegisterForm() {
    const account = document.getElementById('new-account').value;
    const password = document.getElementById('new-password').value;
    const phoneNumber = document.getElementById('new-phone-number').value;
    const email = document.getElementById('new-email').value;

    let isValid = true;
    let errorMessage = '';

    // 驗證帳號格式 (例如：至少3個字符)
    if (account.length < 3) {
        isValid = false;
        errorMessage += '帳號格式錯誤，至少3個字符。\n';
    }

    // 驗證密碼格式 (例如：至少6個字符)
    if (password.length < 6) {
        isValid = false;
        errorMessage += '密碼格式錯誤，至少6個字符。\n';
    }

    // 驗證手機號碼格式 (例如：10位數字)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
        isValid = false;
        errorMessage += '手機號碼格式錯誤，應為10位數字。\n';
    }

    // 驗證電子郵件格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        isValid = false;
        errorMessage += '電子郵件格式錯誤。\n';
    }

    if (!isValid) {
        alert(errorMessage);
    }

    return isValid;
};

function validateAndRegister() {
    if (validateRegisterForm()) {
        const account = document.getElementById('new-account').value;
        const password = document.getElementById('new-password').value;
        const phoneNumber = document.getElementById('new-phone-number').value;
        const email = document.getElementById('new-email').value;

        fetch('https://d1khcxe0f8g5xw.cloudfront.net/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ account, password, phoneNumber, email })
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            if (data === 'User registered successfully') {
                toggleForm('showEmailVerify');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error registering user');
        });
    }
};

document.addEventListener('DOMContentLoaded', (event) => {
    const savedAccount = localStorage.getItem('savedAccount');
    if (savedAccount) {
        document.getElementById('account').value = savedAccount;
        document.getElementById('remember').checked = true;
    }
});

function validateAndLogin() {
    const account = document.getElementById('account').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    fetch('https://d1khcxe0f8g5xw.cloudfront.net/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ account, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            if (remember) {
                localStorage.setItem('savedAccount', account);
            } else {
                localStorage.removeItem('savedAccount');
            }
            localStorage.setItem('account', data.account);
            window.location.href = 'index.html';
        } else {
            alert('Invalid account or password');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error logging in');
    });
};