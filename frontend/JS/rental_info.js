//**************************************************
//Pobieranie szczegółowych informacji dt. rezerwacji
//**************************************************

const rentalId = sessionStorage.getItem('rentalId');
console.log(rentalId);
const container = document.getElementById("main-content-details");

function getReservationInfo() {
    const xhr = new XMLHttpRequest();
    const url = `http://localhost:3000/api/rental/ReservationInfo?id=${rentalId}`
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        alert('Nie jesteś zalogowany. Przekierowanie na stronę logowania.');
        window.location.href = 'login.html'; // Przekierowanie, jeśli brak tokena
    }

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);


    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);

            container.innerHTML = '';

            const reservation = data.find(item => item.rentalId == rentalId);

            if (reservation) {
                container.innerHTML = `
                    <h2>Szczegóły rezerwacji</h2>
                    <p><strong>Imię i nazwisko klienta:</strong> ${reservation.customerName} ${reservation.customerSurname}</p>
                    <p><strong>Adres klienta:</strong> ${reservation.customerAddress}, ${reservation.customerPostalCode}</p>
                    <p><strong>Email klienta:</strong> ${reservation.customerEmail}</p>
                    <p><strong>Samochód:</strong> ${reservation.brand} ${reservation.model} (${reservation.production_year}), kolor: ${reservation.color}</p>
                    <p><strong>Rejestracja:</strong> ${reservation.car_registration}</p>
                    <p><strong>Cena za dzień:</strong> ${reservation.carPrice} PLN</p>
                    <p><strong>Okres wynajmu:</strong> od ${new Date(reservation.start_date).toLocaleString()} do ${new Date(reservation.end_date).toLocaleString()}</p>
                    <p><strong>Cena całkowita:</strong> ${reservation.sum_price} PLN</p>
                    <p><strong>Biuro wynajmu:</strong> ${reservation.officeAddress}, ${reservation.officePostalCode}, ${reservation.cityName}, ${reservation.cityState}</p>
                `;

            } else {
                container.innerHTML = `<p>Nie znaleziono rezerwacji o ID: ${rentalId}</p>`;
            }

        } else {
            console.error('Błąd w żądaniu: ', xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Żądanie nie powiodło się.');
    };

    xhr.send();
}

getReservationInfo();

