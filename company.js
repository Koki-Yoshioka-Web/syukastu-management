document.addEventListener("DOMContentLoaded", function () {
  const companyTable = document
    .getElementById("company-table")
    .getElementsByTagName("tbody")[0];

  // Load saved company data from localStorage
  var companies = JSON.parse(localStorage.getItem("companyData")) || [];

  // Display existing companies when the page loads
  companies.forEach((company) => addCompanyToTable(company));

  // Add a company
  window.addCompany = function () {
    const nameInput = document.getElementById("company-name");
    const urlInput = document.getElementById("company-url");
    const idInput = document.getElementById("company-id");
    const passwordInput = document.getElementById("company-password");

    const company = {
      name: nameInput.value,
      url: urlInput.value,
      id: idInput.value,
      password: passwordInput.value,
    };

    if (company.name && company.url && company.id && company.password) {
      companies.push(company);
      localStorage.setItem("companyData", JSON.stringify(companies));

      addCompanyToTable(company);

      // Clear inputs
      nameInput.value = "";
      urlInput.value = "";
      idInput.value = "";
      passwordInput.value = "";
    }
  };

  // Add company data to the table
  function addCompanyToTable(company) {
    const row = companyTable.insertRow();

    row.insertCell(0).textContent = company.name;
    row.insertCell(
      1
    ).innerHTML = `<a href="${company.url}" target="_blank">${company.url}</a>`;
    row.insertCell(2).textContent = company.id;
    row.insertCell(3).textContent = company.password;

    const deleteCell = row.insertCell(4);
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.onclick = function () {
      deleteCompany(company.name);
    };
    deleteCell.appendChild(deleteButton);
  }

  // Delete a company from the table and localStorage
  function deleteCompany(companyName) {
    companies = companies.filter((company) => company.name !== companyName);
    localStorage.setItem("companyData", JSON.stringify(companies));

    // Refresh the table
    companyTable.innerHTML = "";
    companies.forEach((company) => addCompanyToTable(company));
  }
});
