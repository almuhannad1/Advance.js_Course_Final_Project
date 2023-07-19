//Base URL
const baseUrl = "https://tarmeezacademy.com/api/v1";

//Login
function loginBtnClick() {
  const userName = document.getElementById("user-name").value;
  const password = document.getElementById("password-input").value;

  toggleLoader(true);
  axios
    .post(`${baseUrl}/login`, {
      username: userName,
      password: password,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      //I use JSON.stringify() because it is json not string
      localStorage.setItem("user", JSON.stringify(response.data.user));
      //To close the model win after user enter correct data
      const modal = document.getElementById("loginModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("Logged in Successfully", "success");
      setUpUI();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

//Register
function registerBtnClick() {
  const nameRegister = document.getElementById("register-name-input").value;
  const userNameRegister = document.getElementById(
    "register-username-input"
  ).value;
  const passwordRegister = document.getElementById(
    "register-password-input"
  ).value;

  const image = document.getElementById("register-image-input").files[0];

  let formData = new FormData();
  formData.append("name", nameRegister);
  formData.append("username", userNameRegister);
  formData.append("password", passwordRegister);
  formData.append("image", image);

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  toggleLoader(true);

  axios
    .post(`${baseUrl}/register`, formData, {
      headers: headers,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      //I use JSON.stringify() because it is json not string
      localStorage.setItem("user", JSON.stringify(response.data.user));
      //To close the model win after user enter correct data
      const modal = document.getElementById("registerModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("New User Registered Successfully", "success");
      setUpUI();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

//Logout
function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("Logged out Successfully", "success");
  setUpUI();
}

//setUpUI
function setUpUI() {
  /*
  visiblity: hidden = اخفاء العنصر مع حجز المكان 
  display: none = اخفاء العنصر مع عدم حجز المكان
  */
  const token = localStorage.getItem("token");

  const loginDiv = document.getElementById("logged-in-div");
  const logoutDiv = document.getElementById("logout-div");

  // add btn
  const addBtn = document.getElementById("add-btn");

  if (token == null) {
    if (addBtn != null) {
      addBtn.style.setProperty("display", "none", "important");
    }
    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
  } else {
    // for logged in user
    if (addBtn != null) {
      addBtn.style.setProperty("display", "block", "important");
    }
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");

    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("nav-user-image").src = user.profile_image;
  }
}

//show alert
function showAlert(custMessage, type) {
  const alertPlaceholder = document.getElementById("Message-Succes-Login");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  appendAlert(custMessage, type);

  //todo: Hide the alert
  setTimeout(() => {
    // const alert = bootstrap.Alert.getOrCreateInstance('#Message-Succes-Login')
    // alert.close()
  }, 4500);
}

//current user
function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");

  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }

  return user;
}

// ================ POST Requests ================

//edit Post btn clicked
function editPostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));

  document.getElementById("post-modal-submit-btn").innerHTML = "Update";
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("title-post-input").value = post.title;
  document.getElementById("description-post-input").value = post.body;
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}

//delete Post btn clicked
function deletePostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));

  document.getElementById("delete-post-id-input").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal"),
    {}
  );
  postModal.toggle();
}

function confirmPostDelete() {
  const postId = document.getElementById("delete-post-id-input").value;
  axios
    .delete(`${baseUrl}/posts/${postId}`, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("The Post has been deleted successfully", "success");
      getPosts();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    });
}

//Create New Post
function createNewPostClicked() {
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";

  const titlePost = document.getElementById("title-post-input").value;
  const descriptionPost = document.getElementById(
    "description-post-input"
  ).value;
  const image = document.getElementById("post-image-input").files[0];

  //Form Data
  let formData = new FormData();
  formData.append("title", titlePost);
  formData.append("body", descriptionPost);
  formData.append("image", image);

  let url = ``;
  if (isCreate == true) {
    url = `${baseUrl}/posts`;
  } else {
    formData.append("_method", "put");
    url = `${baseUrl}/posts/${postId}`;
  }

  axios
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      //To close the model win after user enter correct data
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("New posts has been created", "success");
      getPosts();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    });
}

//profile clicked
function profileClicked() {
  const user = getCurrentUser();
  window.location = `profile.html?userId=${user.id}`;
}

// toggle loader
function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
