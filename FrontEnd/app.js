const gallery = document.querySelector(".gallery");
const btnFilterContainer = document.querySelector(".btn-filter-container");
const logInLogOut = document.getElementById("login");
const editionMode = document.querySelector(".container-edition");
const modalContainer = document.querySelector(".modal-container");
const butonCloseModal = document.querySelectorAll(".close-modal");
const galleryModal = document.querySelector(".gallery-modal");
const portfolio = document.getElementById("portfolio");
const modalPage1 = document.querySelector(".modal-page1");
const modalPage2 = document.querySelector(".modal-page2");
const modalCategory = document.getElementById("modal-category");
const imgPreview = document.querySelector(".img-preview");
const containerImgPreview = document.querySelector(".container-img-preview");
const modalWorkTitle = document.querySelector(".modal-work-title");
const btnSendWork = document.querySelector(".modal-send-work");
const imgUploadInput = document.querySelector(".img-upload-input");

let arrayData;
//  Appel de tous les travaux présents sur l'API
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
    console.log(category);
  } catch (error) {
    console.error("Une erreur s'est produite:", error);
  }
}

// Supression d'un projet sur l'API
const deleteWorkGallery = async (id, e) => {
  const response = await fetch("http://" + window.location.hostname + `:5678/api/works/${id}`, {
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
  });
  //Mise a jour dynamique
  // gallery.textContent = "";
  // galleryModal.innerHTML = "";
  getWorks();
};

// Envois du projet sur la base de données par l'API et verification du formulaire
btnSendWork.addEventListener("click", async () => {
  const errorMsg = document.querySelector(".error-msg-send-work");
  const anim = document.querySelector(".anim-send-work");
  const category = modalCategory.value;
  const image = imgUploadInput.files[0];
  const title = modalWorkTitle.value;
  console.log(category, title.length, image.size);
  // Verification du form avant envois du projet sur l'api
  if (category !== "empty" && title.length > 5 && image.size < 5000000) {
    anim.classList.add("upload");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    formData.append("category", category);
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
      galleryModal.textContent = "";
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

// Ajout des Boutons pour filtrer les projets
// const AddBtnCategory = (allCategory) => {
//   allCategory.forEach((category) => {
//     const btn = document.createElement("button");
//     btn.className = "btn-filter";
//     btn.innerHTML = `${category.name}`;
//     btn.id = `${category.id}`;
//     btnFilterContainer.appendChild(btn);
//     const arrayBtn = [...btnFilterContainer.children];
//     console.log(arrayBtn);
//     btn.addEventListener("click", () => {
//       FilteredWork(btn, arrayBtn);
//     });
//   });
// };
const addBtnCategory = (allCategory) => {
  allCategory.forEach((category) => {
    const btn = document.createElement("button");
    btn.className = "btn-filter";
    btn.innerHTML = `${category.name}`;
    btn.id = `${category.id}`;
    btnFilterContainer.appendChild(btn);
    const arrayBtn = [...btnFilterContainer.children];
    arrayBtn.forEach((btn) => btn.addEventListener("click", () => FilteredWork(btn, arrayBtn)));
  });
};
// Filtrer les projets par categories
function FilteredWork(btn, arrayBtn) {
  arrayBtn.forEach((btn) => btn.classList.remove("select"));
  btn.classList.add("select");

  if (btn.id == 0) {
    console.log(arrayData);
    populateGallery(arrayData);
  } else {
    const fiteredArray = arrayData.filter((works) => works.categoryId.toString() === btn.id);
    populateGallery(fiteredArray);
  }
}

// // Filtrer les projets par categorie

// //All
// const btnAllWorks = document.querySelector(".btn-filter");
// btnAllWorks.addEventListener("click", () => {
//   const arrayBtn = [...btnFilterContainer.children];
//   arrayBtn.forEach((btn) => btn.classList.remove("select"));
//   btnAllWorks.classList.add("select");
//   gallery.textContent = "";
//  populateGallery(arrayData);
// });

// //Filters
// const FilteredWork = (btn) => {
//   console.log(btn);
//   const arrayBtn = [...btnFilterContainer.children];
//   console.log(arrayBtn);
//   arrayBtn.forEach((btn) => btn.classList.remove("select"));
//   gallery.textContent = "";
//   // btn.classList.remove("select");
//   btn.classList.add("select");
//   const fiteredArray = arrayData.filter((works) => works.categoryId.toString() === btn.id);
//  populateGallery(fiteredArray);
// };

// Récupération du cookie qui contient le token
function getCookie(key) {
  return document.cookie.split("=")[1].split(" ")[0];
}
let token = getCookie("token");

//  affichage si connection reussis
if (token) {
  console.log(logInLogOut);
  btnFilterContainer.style = "display: none ;";
  logInLogOut.innerHTML = "logout";
  logInLogOut.href = "#";
  editionMode.style = "display: flex";
  const logoContainer = document.createElement("div");
  logoContainer.className = "container-logo-edit";
  logoContainer.innerHTML = `<img class="logo-edit" src=./assets/icons/pen-to-square-regular.svg>
  <p>Modifier<p>`;
  portfolio.appendChild(logoContainer);
  logoContainer.addEventListener("click", () => worksModify());
}

//LogOut
logInLogOut.addEventListener("click", () => {
  logInLogOut.innerHTML = "login";
  console.log((document.cookie = `token=${token} path=/; max-age=${-1}`));
  document.cookie = `token=${token} path=/; max-age=${-1}`;
  window.location.href = "http://" + window.location.hostname + ":5500/index.html";
});

// Ouverture de la modal
function worksModify() {
  // galleryModal.innerHTML = "";
  // populateGalleryModal();
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
    deleteWork.addEventListener("click", (e) => {
      deleteWorkGallery(work.id, e);
    });
  });
}

// Fermer la Modal avec le btn close

// butonCloseModal.forEach((el) =>
//   el.addEventListener("click", () => {
//     console.log("yes");
//     if (modalPage2.classList.contains("active")) {
//       modalPage2.classList.remove("active");
//       modalPage1.classList.add("active");
//       modalContainer.style = "display: none;";
//     } else {
//       modalContainer.style = "display: none;";
//     }
//   })
// );

// logique pour fermer la modale au clique ou dehors de la modal
// modalContainer.addEventListener("click", (e) => {
//   if (e.target.className === "modal-container") {
//     modalContainer.style = "display: none;";
//     modalPage2.classList.contains("active") ? modalPage2.classList.remove("active") + modalPage1.classList.add("active") : null;
//   }
// });

function closeModal() {
  butonCloseModal.forEach((el) =>
    el.addEventListener("click", () => {
      console.log("yes");
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

// // aller a la page 2 de la modal

// document.getElementById("btn-new-work").addEventListener("click", () => {
//   modalPage1.classList.remove("active");
//   modalPage2.classList.add("active");
// });

// // revenir a la page 1 de la modal
// const arrowBackPage1 = document.getElementById("img-arrow-back-page1");
// arrowBackPage1.addEventListener("click", () => {
//   modalPage1.classList.add("active");
//   modalPage2.classList.remove("active");
// });

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
  console.log(imageUrl.replace("blob:", ""));
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
