const gallery = document.querySelector(".gallery");
const btnFilterContainer = document.querySelector(".btn-filter-container");
const logInLogOut = document.getElementById("login");
const editionMode = document.querySelector(".container-edition");
const modalContainer = document.querySelector(".modal-container");
const butonCloseModal = document.querySelectorAll(".close-modal");
const galleryModal = document.querySelector(".gallery-modal");
const portfolio = document.getElementById("portfolio");
const editProfilePic = document.querySelector(".edit-profile-pic-container");
const editBio = document.getElementById("logo-edition-intro");
const modalPage1 = document.querySelector(".modal-page1");
const modalPage2 = document.querySelector(".modal-page2");
const modalCategory = document.getElementById("modal-category");
const imgPreview = document.querySelector(".img-preview");
const containerImgPreview = document.querySelector(".container-img-preview");
const modalWorkTitle = document.querySelector(".modal-work-title");
const btnSendWork = document.querySelector(".modal-send-work");
const imgUploadInput = document.querySelector(".img-upload-input");

let arrayData;
//  Recuperation de tous les travaux présents sur l'API
async function getWorks() {
  try {
    const response = await fetch("http://" + window.location.hostname + ":5678/api/works");
    const data = await response.json();
    arrayData = data;
    populateGallery(data);
    populateGalleryModal(data);
  } catch (error) {
    console.error("Une erreur s'est produite:", error);
  }
}

//  Appel a l'API pour récupérer les categories des projets
async function getCategory() {
  try {
    const response = await fetch("http://" + window.location.hostname + ":5678/api/categories");
    const category = await response.json();
    addBtnCategory(category);
    populateCategoryModal(category);
  } catch (error) {
    console.error("Une erreur s'est produite:", error);
  }
}

// Supression d'un projet sur l'API
const deleteWorkGallery = async (id) => {
  const response = await fetch("http://" + window.location.hostname + `:5678/api/works/${id}`, {
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
  });
  getWorks();
};

// Envois du projet sur la base de données par l'API et verification du formulaire
btnSendWork.addEventListener("click", async () => {
  const errorMsg = document.querySelector(".error-msg-send-work");
  const anim = document.querySelector(".anim-send-work");
  const category = modalCategory.value;
  const image = imgUploadInput.files[0];
  const title = modalWorkTitle.value;

  // Verification du form avant envois du projet sur l'api
  if (category !== "empty" && title.length > 5 && image.size < 5000000) {
    anim.classList.add("upload");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    formData.append("category", category);
    console.log(title, category);
    let response = await fetch("http://" + window.location.hostname + ":5678/api/works", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: formData,
    });
    //Mise a jour dynamique
    setTimeout(() => {
      anim.classList.remove("upload");
      containerImgPreview.style = "display: none";
      modalWorkTitle.value = "";
      modalCategory.value = "empty";
      imgUploadInput.value = "";
      gallery.textContent = "";

      getWorks();
    }, 600);

    errorMsg.style = "display: none";
  } else {
    errorMsg.style = "display: block";
  }
});

// initialisation du projet
const initScript = () => {
  getWorks();
  getCategory();
  populateCategoryModal();
  closeModal();
  changePageModal();
};
initScript();

// Ajout des Projets
const populateGallery = (data) => {
  gallery.textContent = "";
  data.forEach((works) => {
    const fig = document.createElement("figure");
    fig.innerHTML = `<img src=${works.imageUrl} alt=${works.title}>
    <figcaption>${works.title}</figcaption>`;
    gallery.appendChild(fig);
  });
};

const addBtnCategory = (allCategory) => {
  allCategory.forEach((category) => {
    const btn = `<button class="btn-filter" id=${category.id}>${category.name}</button>`;
    btnFilterContainer.innerHTML += btn;
  });
  //Event au click pour filtrer
  const arrayBtn = [...btnFilterContainer.children];
  arrayBtn.forEach((btn) => btn.addEventListener("click", () => FilteredWork(btn, arrayBtn)));
};

// Filtrer les projets par categories
function FilteredWork(btn, arrayBtn) {
  arrayBtn.forEach((btn) => btn.classList.remove("select"));
  btn.classList.add("select");

  if (btn.id == 0) {
    populateGallery(arrayData);
  } else {
    const fiteredArray = arrayData.filter((works) => works.categoryId.toString() === btn.id);
    populateGallery(fiteredArray);
  }
}

// Récupération du cookie qui contient le token
function getCookie() {
  return document.cookie.split("=")[1].split(" ")[0];
}
let token = getCookie("token");

//  affichage si connection reussis
if (token) {
  btnFilterContainer.style = "display: none ;";
  logInLogOut.innerHTML = "logout";
  logInLogOut.href = "#";
  editionMode.style = "display: flex";
  editBio.style = "display: flex;";
  editProfilePic.style = "display: flex;";
  const logoContainer = document.createElement("div");
  logoContainer.className = "container-logo-edit";
  logoContainer.innerHTML = `<img class="logo-edit" src=./assets/icons/pen-to-square-regular.svg>
  <p>Modifier<p>`;
  portfolio.appendChild(logoContainer);
  logoContainer.addEventListener("click", () => openModal());
}

//LogOut
logInLogOut.addEventListener("click", () => {
  logInLogOut.innerHTML = "login";
  document.cookie = `token=${token} path=/; max-age=${-1}`;
  window.location.href = "http://" + window.location.hostname + ":" + window.location.port + "/index.html";
});

// Ouverture de la modal
function openModal() {
  modalContainer.style = "display: flex;";
}

function populateGalleryModal(data) {
  galleryModal.innerHTML = "";
  data.forEach((work) => {
    const workContainer = document.createElement("fig");
    workContainer.className = "modal-work-container";
    workContainer.innerHTML = `<img class="pic-gallery-modal" src=${work.imageUrl} alt=${work.title}>
                               <p>éditer</p`;
    galleryModal.appendChild(workContainer);
    //Bouton pour supprimer un projet
    const deleteWork = document.createElement("img");
    deleteWork.className = "delete-work";
    deleteWork.src = "./assets/icons/trash-can-solid.svg";
    deleteWork.id = `${work.id}`;
    workContainer.appendChild(deleteWork);
    //Appel de function pour supprimmer un projet
    deleteWork.addEventListener("click", () => {
      deleteWorkGallery(work.id);
    });
  });
  //Ajout du logo resize
  const btnSize = [...galleryModal.children];
  const imgSize = `<img class="logo-size-img" src="./assets/icons/maximize-solid.svg" alt='image taille'>`;
  btnSize[0].innerHTML += imgSize;
}

function closeModal() {
  butonCloseModal.forEach((el) =>
    el.addEventListener("click", () => {
      modalPage2.classList.remove("active");
      modalPage1.classList.add("active");
      modalContainer.style = "display: none;";
    })
  );
  // Fermer la modal au clic en dehors
  modalContainer.addEventListener("click", (e) => {
    if (e.target.className === "modal-container") {
      modalContainer.style = "display: none;";
      modalPage2.classList.contains("active") ? modalPage2.classList.remove("active") + modalPage1.classList.add("active") : null;
    }
  });
}

function changePageModal() {
  // aller a la page 2 de la modal
  document.getElementById("btn-new-work").addEventListener("click", () => {
    modalPage1.classList.remove("active");
    modalPage2.classList.add("active");
  });
  // revenir a la page 1 de la modal
  const arrowBackPage1 = document.getElementById("img-arrow-back-page1").addEventListener("click", () => {
    modalPage1.classList.add("active");
    modalPage2.classList.remove("active");
  });
}

// Preview de l'image selectionée
imgUploadInput.addEventListener("input", previewImgModal);
function previewImgModal() {
  containerImgPreview.style = "display: block";
  const file = imgUploadInput.files[0];
  const imageUrl = URL.createObjectURL(file);
  imgPreview.src = imageUrl;
}
// Ajouter les categories dans la modal
function populateCategoryModal(category) {
  if (category) {
    category.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      modalCategory.appendChild(option);
    });
  }
}
