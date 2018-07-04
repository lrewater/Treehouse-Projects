class Employee {
  constructor(options) {
    this.name = options.name;
    this.email = options.email;
    this.location = options.location;
    this.photo = options.photo;
    this.cell = options.cell;
    this.detailedAddress = options.detailedAddress;
    this.birthday = options.birthday;
    this.createCard();
  }

  createCard() {
    const $container = document.querySelector(".container"),
          $employeeCard = document.createElement("div");

    $employeeCard.classList.add("employee-card-wrapper");
    $employeeCard.innerHTML = `
      <div class="employee-card layout-padding">
        <img class="employee-img" src="${this.photo}"/>
        <div class="employee-info">
          <h2 class="employee-name">${this.name}</h2>
          <div class="employee-email">${this.email}</div>
          <div class="employee-location">${this.location}</div>
        </div>
      </div>`;
    $container.appendChild($employeeCard);

    $employeeCard.addEventListener("click", this.createModal.bind(this));
  }

  createModal() {
    const body = document.querySelector("body"),
          $backdrop = document.createElement("div"),
          $modal = document.createElement("div");

    $backdrop.classList.add("backdrop");
    $modal.classList.add("modal");

    $modal.innerHTML = `
      <div class="modal-close-btn">X</div>
      <div class="modal-employee-img-wrapper">
        <img class="modal-employee-img" src="${this.photo}"/>
      </div>
      <h2 class="modal-employee-name">${this.name}</h2>
      <div class="modal-employee-email">${this.email}</div>
      <div class="modal-employee-location">${this.location}</div>
      <div class="divider"></div>
      <div class="modal-employee-cell">${this.cell}</div>
      <div class="modal-employee-address">${this.detailedAddress}</div>
      <div class="modal-employee-birthday">Birthday: ${this.birthday}</div>
    `;

    body.appendChild($backdrop);
    body.appendChild($modal);

    const $closeBtn = $modal.querySelector(".modal-close-btn");
    $closeBtn.addEventListener("click", (e) => {
      $modal.remove();
      $backdrop.remove();
    })
  }
}

const fetchEmployee = () => {
  return fetch('https://randomuser.me/api/')
    .then((response) => {
      return response.json();
    })
}

const createEmployee = (data) => {
  const d = data.results[0];
  return new Employee({
    name: `${d.name.first} ${d.name.last}`,
    email: d.email,
    location: d.location.city,
    photo: d.picture.large,
    cell: d.cell,
    detailedAddress: `${d.location.street} ${d.location.city}, ${d.location.state}  ${d.location.postcode}`,
    birthday: formatDate(d.dob.date)
  })
}

const formatDate = (date) => {
  const newDate = new Date(date);
  return `${newDate.getMonth()}/${newDate.getDate()}/${newDate.getFullYear()}`;
}


for ( let i = 0; i < 12; i++) {
  fetchEmployee()
    .then((data) => {
      createEmployee(data);
    });
}
