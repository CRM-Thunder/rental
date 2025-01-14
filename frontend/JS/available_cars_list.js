//*******************************
//Pobieranie listy dostępnych aut
//*******************************

function getAvailableCars() {
    const params = new URLSearchParams(window.location.search);
    const officeId = params.get('office_id');
    const startDate = params.get('start_date');
    const endDate = params.get('end_date');

    const xhr = new XMLHttpRequest();
    const url = 'http://localhost:3000/api/rental/AvailableCars';

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            const cars = JSON.parse(xhr.responseText);
            const carList = document.getElementById('car-list');

            if (cars.length === 0) {
                document.getElementById('fail-container').style.display = 'block';
            } else {
                cars.forEach(car => {
                    const carButton = document.createElement('button');
                    carButton.classList.add('car-button');
                    carButton.innerHTML = `<h3>${car.brand}</h3><p>Model: ${car.model}</p><p>Rocznik: ${car.productionYear}</p>`;

                    carButton.addEventListener('click', function () {
                        const params = new URLSearchParams({
                            office_id: officeId,
                            start_date: startDate,
                            end_date: endDate,
                            car_id: car.id
                        });

                        window.location.href = `client_form.html?${params.toString()}`;
                    });

                    carList.appendChild(carButton);
                });
            }
        } else {
            console.error('Błąd podczas pobierania aut:', xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Błąd sieci podczas pobierania aut.');
    };

    const requestBody = {
        office_id: officeId,
        start_date: startDate,
        end_date: endDate
    };
    xhr.send(JSON.stringify(requestBody));
}

getAvailableCars();
