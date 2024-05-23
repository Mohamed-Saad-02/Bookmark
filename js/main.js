const siteName = document.getElementById("siteName");
const siteURL = document.getElementById("siteURL");
const submitBtn = document.getElementById("submitBtn");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModalBtn");

// Regex of SiteName and SiteURL
const siteNameRegex = /^\w{3,}(\s+\w+)*$/;
const siteURLRegex =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

let siteContainer = [];

// ==== Check If There Is Data In LocalStorage ====
if (localStorage.getItem("sites")) {
  siteContainer = JSON.parse(localStorage.getItem("sites"));
  displaySites(siteContainer);
}

submitBtn.addEventListener("click", () => {
  addSite();
});

// ==== Main Function To Site ====
function addSite() {
  const isValidSiteName = validation(siteName, siteNameRegex);
  const isValidSiteURL = validation(siteURL, siteURLRegex);

  if (isValidSiteName && isValidSiteURL) {
    const siteInfo = {
      siteName: siteName.value,
      siteURL: siteURL.value,
    };

    siteContainer.push(siteInfo);
    localStorage.setItem("sites", JSON.stringify(siteContainer));
    displaySites(siteContainer);
    clearInputs();
  } else {
    document.body.classList.add("overflow-hidden");
    modal.classList.add("active");
  }
}

// ==== Display Sites On Page ====
function displaySites(arr = siteContainer) {
  let box = "";
  for (let i = 0; i < arr.length; i++) {
    box += `
    <tr data-index=${i}>
      <td>${i + 1}</td>
      <td>
        <div
          class="d-flex align-items-center justify-content-center gap-2"
        >
          <div class="image">
          <img
            src="https://www.google.com/s2/favicons?domain=${
              arr[i].siteURL
            }&sz=128"
            alt="facebook"
            loading="lazy"
            class="d-block icon w-100"
          />
          </div>
          <span class="text-capitalize">${arr[i].siteName}</span>
        </div>
      </td>
      <td>
        <button class="btn visit" id="visitBtn" onclick="visitURL('${
          arr[i].siteURL
        }')">
          <i class="fa-solid fa-eye pe-2"></i>Visit
        </button>
      </td>
      <td>
        <button class="btn pe-2 delete" onclick="deleteSite(${i})">
          <i class="fa-solid fa-trash-can"></i>
          Delete
        </button>
      </td>
    </tr>
    `;
  }

  document.getElementById("tableContent").innerHTML = box;
}

// ==== Handle Clear Inputs ====
function clearInputs() {
  siteName.value = "";
  siteURL.value = "";
  if (siteName.classList.contains("is-valid")) {
    siteName.classList.remove("is-valid");
  }
  if (siteURL.classList.contains("is-valid")) {
    siteURL.classList.remove("is-valid");
  }
}

// ==== Handle Visit URL ====
function visitURL(url) {
  const reg = /^https?:\/\//;
  if (reg.test(url)) {
    window.open(url, "_blank");
  } else {
    window.open(`https://${url}`, "_blank");
  }
}

// ==== Handle Delete Site ====
function deleteSite(index) {
  siteContainer.splice(index, 1);
  localStorage.setItem("sites", JSON.stringify(siteContainer));
  displaySites(siteContainer);
}

// Check Correct Data From User
siteName.addEventListener("input", () => {
  validation(siteName, siteNameRegex);
});
siteURL.addEventListener("input", () => {
  validation(siteURL, siteURLRegex);
});

function validation(element, reg) {
  if (reg.test(element.value)) {
    if (element.classList.contains("is-invalid")) {
      element.classList.replace("is-invalid", "is-valid");
    }
    return true;
  } else {
    if (element.classList.contains("is-valid")) {
      element.classList.remove("is-valid");
    }
    element.classList.add("is-invalid");
    return false;
  }
}

// ==== Close Modal ====
closeModalBtn.addEventListener("click", closeModal);

document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("active") &&
    e.target.classList.contains("data-info")
  ) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key == "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});

function closeModal() {
  modal.classList.remove("active");
  document.body.classList.remove("overflow-hidden");
}
