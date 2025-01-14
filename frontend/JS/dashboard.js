const itemUnverifiedList = document.getElementById('item-list');
const itemVerifiedList = document.getElementById('item-list-verified');

function verify(id){
    const token = sessionStorage.getItem('authToken');

    if (!token) {
        alert('Brak tokena. Zaloguj się ponownie.');
        window.location.href = 'login.html';
        return;
    }

    const xhr = new XMLHttpRequest();
    const url = `http://localhost:3000/api/rental/Verify?id=${id}`;

    xhr.open('PUT', url, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.onload = function () {
        if (xhr.status === 200) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Rezerwacja została potwierdzona",
                showConfirmButton: false,
                timer: 2500
            }).then(() => {
                getUnverifiedReservations();
                getVerifiedReservations();
            });
        } else {
            alert(`Nie udało się zweryfikować rezerwacji. Status: ${xhr.status}`);
        }
    };

    xhr.onerror = function () {
        console.error('Błąd podczas weryfikowania.');
        alert('Wystąpił błąd połączenia z serwerem.');
    };

    xhr.send();

}

function deleteItem(id) {

    const token = sessionStorage.getItem('authToken');

    if (!token) {
        alert('Brak tokena. Zaloguj się ponownie.');
        window.location.href = 'login.html';
        return;
    }

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            const xhr = new XMLHttpRequest();
            const url = `http://localhost:3000/api/rental/Reservation?id=${id}`;

            xhr.open('DELETE', url, true);

            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);

            xhr.onload = function () {
                if (xhr.status === 200) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    }).then(() => {
                        getUnverifiedReservations();
                        getVerifiedReservations();
                    });
                } else {
                    alert(`Nie udało się usunąć podcastu. Status: ${xhr.status}`);
                }
            };

            xhr.onerror = function () {
                console.error('Błąd podczas usuwania podcastu.');
                alert('Wystąpił błąd połączenia z serwerem.');
            };

            xhr.send();
        }
    });

}

function getUnverifiedReservations() {
    const xhr = new XMLHttpRequest();
    const url = "http://localhost:3000/api/rental/UnverifiedReservations";
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

            itemUnverifiedList.innerHTML = '';

            data.forEach(item => {
                const listItem = document.createElement('li');

                listItem.innerHTML = `
                    <div class="left-block">
                        <h1>${item.brand} ${item.model}</h1>
                        <h5>${item.customerName} ${item.customerSurname}</h5>
                    </div>
                    <div class="right-block">
                        <button class="button-edit" onclick="verify('${item.rentalId}')">
                            Zweryfikuj
                        </button>
                        <button class="button-delete" onclick="deleteItem('${item.rentalId}')">
                            Usuń
                        </button>
                    </div>
                `;

                itemUnverifiedList.appendChild(listItem);
            });
        } else {
            console.error('Błąd w żądaniu: ', xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Żądanie nie powiodło się.');
    };

    xhr.send();
}

function saveIdAndNavigate(id) {
    sessionStorage.setItem('rentalId', id);
    window.location.href = '../HTML+CSS/rental_info.html';
}

function getVerifiedReservations() {
    const xhr = new XMLHttpRequest();
    const url = "http://localhost:3000/api/rental/VerifiedReservations";
    const token = sessionStorage.getItem('authToken');

    if (!token) {
        alert('Nie jesteś zalogowany. Przekierowanie na stronę logowania.');
        window.location.href = 'login_form.html';
    }

    xhr.open('GET', url, true);

    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);

            itemVerifiedList.innerHTML = '';

            data.forEach(item => {
                const listItem = document.createElement('li');

                const startDate = new Date(item.leaseStartDate);
                const endDate = new Date(item.leaseEndDate);

                const formattedStartDate = startDate.toLocaleString('pl-PL', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const formattedEndDate = endDate.toLocaleString('pl-PL', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                listItem.innerHTML = `
                    <div class="left-block">
                        <h1>${item.brand} ${item.model}</h1>
                        <h5>Od: ${formattedStartDate} Do: ${formattedEndDate}</h5>
                    </div>
                    <div class="right-block">
                        <button class="button-info" onclick="saveIdAndNavigate('${item.rentalId}')">
                            Informacje
                        </button>
                        <button class="button-delete" onclick="deleteItem('${item.rentalId}')">
                            Usuń
                        </button>
                    </div>
                `;

                itemVerifiedList.appendChild(listItem);
            });
        } else {
            console.error('Błąd w żądaniu: ', xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Żądanie nie powiodło się.');
    };

    xhr.send();
}

getUnverifiedReservations();
getVerifiedReservations();