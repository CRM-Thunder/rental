//*********************
//Pobieranie listy biur
//*********************


function getOffices() {
    const xhr = new XMLHttpRequest();
    const url = 'http://localhost:3000/api/rental/Offices';

    xhr.open('GET', url, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const offices = JSON.parse(xhr.responseText);
            const officeSelect = document.getElementById('office-select');

            offices.forEach(office => {
                const option = document.createElement('option');
                option.value = office.id;
                option.textContent = `${office.address}, ${office.postalCode}, ${office.cityName}, ${office.cityState}`;
                officeSelect.appendChild(option);
            });
        } else {
            console.error('Błąd podczas pobierania biur:', xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Błąd sieci podczas pobierania biur.');
    };

    xhr.send();
}

getOffices();


//********************
//Walidacja formularza
//********************

function validateDates(){
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const now = new Date();
    const dateTimeValue = now.toISOString().slice(0, 16);

    if (startDate > endDate) {
        Swal.fire({
            icon: 'error',
            title: 'Błąd',
            text: `Data zakończenia nie może być wcześniejsza niż data rozpoczęcia!`,
            confirmButtonColor: '#0984f8'
        });
        return false;
    }
    if (startDate < dateTimeValue || endDate < dateTimeValue) {
        Swal.fire({
            icon: 'error',
            title: 'Błąd',
            text: `Data rozpoczęcia/zakończenia nie może być wcześniejsza niż aktualna data!`,
            confirmButtonColor: '#0984f8'
        });
        return false;
    }
    return true;
}

//******************
//Obsługa formularza
//******************

document.getElementById('appointment-form').addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateDates()) {
        return;
    }

    const officeId = document.getElementById('office-select').value;
    const startDate = document.getElementById('start-date').value;
    console.log(startDate);

    const endDate = document.getElementById('end-date').value;
    console.log(endDate);

    const params = new URLSearchParams({
        office_id: officeId,
        start_date: startDate,
        end_date: endDate
    });

    window.location.href = `../HTML+CSS/available_cars_list.html?${params.toString()}`;

});
