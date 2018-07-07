class Search {
  constructor(options) {
    this.container = document.querySelector(options.container);
    this.data = options.data;
  }

  search() {
    const val = this.container.value.toLowerCase();
    return this.data
      .filter((d) => d.name.toLowerCase().includes(val) || d.username.toLowerCase().includes(val) );
  }
}

/**
 * Create an Employee class to make creating a new employee fairly modular
 */
class Employee {

  /**
   * Constructor function to initialize Employee properties
   * Passed an options object
   * @param {object} options [configuration options for employee]
   */
  constructor(options) {
    this.name = options.name;
    this.email = options.email;
    this.location = options.location;
    this.photo = options.photo;
    this.cell = options.cell;
    this.detailedAddress = options.detailedAddress;
    this.birthday = options.birthday;
    this.username = options.username;
    this.createCard();
  }

  /**
   * This method is used to generate the HTML for an employee card and append it to the page
   * @return {[type]} [description]
   */
  createCard() {
    const $container = document.querySelector(".container"),
          $employeeCard = document.createElement("div");

    $employeeCard.id = `employee-card-${Math.floor(1000 + Math.random() * 9000)}`;
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
    this.container = document.querySelector(`#${$employeeCard.id}`);

    $employeeCard.addEventListener("click", this.createModal.bind(this));
  }

  removeCard() {
    this.container.remove();
  }

  /**
   * This method is used to the generate the HTML for an employee modal and append it to the page
   * @return {[type]} [description]
   */
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

/**
 * This function is used to fetch the employee data from the random user api
 * @return {object} [returns the response from the random user api as JSON]
 */
const fetchEmployee = () => {
  return fetch('https://randomuser.me/api/?nat=us')
    .then((response) => {
      return response.json();
    })
}

/**
 * This function is used to create employees from the data returned from the random user api
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const createEmployee = (data) => {
  const d = data.results[0];
  const employee = {
    name: `${d.name.first} ${d.name.last}`,
    email: d.email,
    location: d.location.city,
    photo: d.picture.large,
    cell: d.cell,
    detailedAddress: `${d.location.street} ${d.location.city}, ${d.location.state}  ${d.location.postcode}`,
    birthday: formatDate(d.dob.date),
    username: d.login.username
  }
  directorySearch.data.push(employee);
  return new Employee(employee);
}

/**
 * This function is used to format a date in the mm/dd/yyy format
 * @param  {string/date} date [date to format]
 * @return {date}      [formatted date]
 */
const formatDate = (date) => {
  const newDate = new Date(date);
  return `${newDate.getMonth()}/${newDate.getDate()}/${newDate.getFullYear()}`;
}

const directorySearch = new Search({
  container: "#search",
  data: []
})

const bindEvents = (() => {
  directorySearch.container.addEventListener("keyup", (e) => {
    const filteredData = directorySearch.search();
    const filteredNames = filteredData
      .map((d) => d.name );
    const filteredUsernames = filteredData
      .map((d) => d.username );

    const filteredEmployees = employees
      .filter((employee) => {
        return filteredNames.includes(employee.name) || filteredUsernames.includes(employee.username)
      });

    employees.forEach((v,k) => { v.removeCard(); })
    filteredEmployees.forEach((v,k) => { v.createCard(); });
  })
})();

const employees = [];

/**
 * Create 12 employees
 */
for ( let i = 0; i < 12; i++) {
  fetchEmployee()
    .then((data) => {
      employees.push(createEmployee(data));
    });
}
