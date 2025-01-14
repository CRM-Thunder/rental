//********************
//Walidacja formularza
//********************

function validateForm(){
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const age = document.getElementById("age").value;
    const address = document.getElementById("address").value;
    const postalCode = document.getElementById("postal_code").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const email = document.getElementById("email").value;

    if (name === "" || surname === "" || age === "" || address === "" || postalCode === "" || city === "" || state === "" || email === ""){
        Swal.fire({
            icon: 'error',
            title: 'Błąd',
            text: `Nie uzupełniłeś wszystkich pól w formularzu!`,
            confirmButtonColor: '#0984f8'
        });
        return false;
    }

    if (age < 0){
        Swal.fire({
            icon: 'error',
            title: 'Błąd',
            text: `Wprowadzono niepoprawny wiek!`,
            confirmButtonColor: '#0984f8'
        });
        return false;
    }

    if (age < 18){
        Swal.fire({
            icon: 'error',
            title: 'Błąd',
            text: `Nie możesz wynająć auta mając mniej niż 18 lat!`,
            confirmButtonColor: '#0984f8'
        });
        return false;
    }


    const namePattern = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*$/i;
    const surnamePattern = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*$/i;
    const addressPattern = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]* \d+$/;
    const postalCodePattern = /^\d\d-\d\d\d$/;
    const cityPattern = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż\s-]*$/i;
    const statePattern = /^[A-ZĄĆĘŁŃÓŚŹŻa-ząćęłńóśźż\s-]*$/i;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!namePattern.test(name)) {
        Swal.fire({
            icon: 'error',
            title: 'Błąd',
            text: `Błędne dane w polu imie!`,
            confirmButtonColor: '#0984f8'
        });
        return false;
    }

    if (!surnamePattern.test(surname)) {
        Swal.fire({
            icon: 'error',
            title: 'Błąd',
            text: `Błędne dane w polu nazwisko!`,
            confirmButtonColor: '#0984f8'
        });
        return false;
    }

    if (!addressPattern.test(address)) {
        Swal.fire({
            icon: 'error',
            title: 'Błąd',
            text: `Błędne dane w polu adres!`,
            confirmButtonColor: '#0984f8'
        });
        return false;
    }

    if (!postalCodePattern.test(postalCode)) {
        Swal.fire({
            icon: 'error',
            title: 'Błąd',
            text: `Błędne dane w polu kod pocztowy!`,
            confirmButtonColor: '#0984f8'
        });
        return false;
    }

    if (!cityPattern.test(city)) {
        Swal.fire({
            icon: 'error',
            title: 'Błąd',
            text: `Błędne dane w polu miasto!`,
            confirmButtonColor: '#0984f8'
        });
        return false;
    }

    if (!statePattern.test(state)) {
        Swal.fire({
            icon: 'error',
            title: 'Błąd',
            text: `Błędne dane w polu województwo!`,
            confirmButtonColor: '#0984f8'
        });
        return false;
    }

    if (!emailPattern.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Błąd',
            text: `Błędne dane w polu email!`,
            confirmButtonColor: '#0984f8'
        });
        return false;
    }
    return true;
}


//**************************
//Obsługa formularza klienta
//**************************

document.getElementById('client-form').addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateForm()) {
        return; // Zatrzymaj dalsze wykonywanie, jeśli walidacja nie przeszła
    }


    const params = new URLSearchParams(window.location.search);
    const startDate = params.get('start_date');
    const endDate = params.get('end_date');
    const carId = params.get('car_id');



    const customer = {
        name: document.getElementById('name').value,
        surname: document.getElementById('surname').value,
        age: document.getElementById('age').value,
        address: document.getElementById('address').value,
        postal_code: document.getElementById('postal_code').value,
        city_name: document.getElementById('city').value,
        state_name: document.getElementById('state').value,
        email: document.getElementById('email').value
    };

    const requestBody = {
        car_id: carId,
        customer: customer,
        start_date: startDate,
        end_date: endDate
    };


    //**********************
    //Dokonywanie rezerwacji
    //**********************


    const xhr = new XMLHttpRequest();
    const url = 'http://localhost:3000/api/rental/Reservation';

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
                Swal.fire({
                    position: "middle",
                    icon: "success",
                    title: "Dokonano pomyślnej rezerwacji!",
                    showConfirmButton: false,
                    timer: 2500
                });
                window.location.href = 'index.html';
            } else {
                alert('Wystąpił błąd: ' + response.message);
            }
        } else {
            console.error('Błąd serwera:', xhr.statusText);
            alert('Wystąpił problem z połączeniem z serwerem.');
        }
    };

    xhr.onerror = function () {
        console.error('Błąd sieci podczas wysyłania żądania.');
        alert('Wystąpił błąd sieci. Spróbuj ponownie później.');
    };

    xhr.send(JSON.stringify(requestBody));
});
