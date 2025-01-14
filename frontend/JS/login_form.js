document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Zapobiega domyślnemu działaniu formularza (przeładowanie strony)

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    // Przygotowanie danych do wysłania
    const requestData = {
        login: login,
        password: password
    };

    const xhr = new XMLHttpRequest();
    const url = 'http://localhost:3000/api/rental/Login';

    xhr.open('POST', url, true);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);

            if (data.success) {
                sessionStorage.setItem('authToken', data.token);
                window.location.href = `../HTML+CSS/dashboard.html`;
            } else {
                alert('Złe hasło, spróbuj ponownie.');
            }
        } else {
            alert('Wystąpił błąd podczas logowania. Spróbuj ponownie później.');
        }
    };

    // Wysyłamy dane do serwera w formacie JSON
    xhr.send(JSON.stringify(requestData));
});