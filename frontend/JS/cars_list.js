//********************
//Pobieranie listy aut
//********************

const container = document.getElementById("main-content-cars");

function getCarsList() {
    const xhr = new XMLHttpRequest();
    const url = "http://localhost:3000/api/rental/Cars"

    xhr.open('GET', url, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);

            container.innerHTML = '';

            data.forEach(car => {
                const carBlock = document.createElement('div');
                carBlock.classList.add('car-block');
                carBlock.innerHTML = `<h3>${car.brand}</h3><p>Model: ${car.model}</p><p>Rocznik: ${car.productionYear}</p>`;
                container.appendChild(carBlock);
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

getCarsList();
