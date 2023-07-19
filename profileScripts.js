setUpUI();
getUser();
getPosts();

function getCurrentUserId() {
  // To get id of user
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("userId");

  return id;
}

//Get user
function getUser() {
  const id = getCurrentUserId();
  toggleLoader(true);

  axios
    .get(`${baseUrl}/users/${id}`)
    .then((response) => {
      console.log(response)
      const user = response.data.data;
      document.getElementById("header-image").src = user.profile_image;

      document.getElementById("main-info-email").innerHTML = user.email;
      document.getElementById("main-info-name").innerHTML = user.name;
      document.getElementById("main-info-username").innerHTML = user.username;

      document.getElementById("posts-count").innerHTML = user.posts_count;
      document.getElementById("comments-count").innerHTML = user.comments_count;

      document.getElementById("name-posts").innerHTML = `${user.username}'s `;
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
    
}

// Get Posts
function getPosts() {
  const id = getCurrentUserId();
  toggleLoader(true);

  axios
    .get(`${baseUrl}/users/${id}/posts`)
    .then((response) => {
      let posts = response.data.data;

      document.getElementById("user-posts").innerHTML = "";

      for (post of posts) {
        const author = post.author;
        let postTitle = "";

        // show or hide (edit) button
        let user = getCurrentUser();
        let isMyPost = user != null && post.author.id == user.id;
        let editBtnContent = ``;

        if (isMyPost) {
          editBtnContent = `
            <button class="btn btn-danger" style="float: right; margin-left: 5px;" onclick="deletePostBtnClicked('${encodeURIComponent(
              JSON.stringify(post)
            )}')">Delete</button>   
          
            <button class="btn btn-secondary" style="float: right;" onclick="editPostBtnClicked('${encodeURIComponent(
              JSON.stringify(post)
            )}')">Edit</button>`;
        }

        if (post.title != null) {
          postTitle = post.title;
        }
        let content = `
                                  
                                  <div class="card shadow">
                                      <div class="card-header">
                                          <img class="img-thumbnail rounded-circle border-2" style="width: 40px; height: 40px;" src="${post.author.profile_image}">
                                          <b>@${author.username}</b>
  
                                          ${editBtnContent}
                                      </div>
  
                                      <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer">
                                          <img class="w-100" src="${post.image}" alt="">
  
                                          <h6 class="mt-1" style="color: grey;">
                                              ${post.created_at}
                                          </h6>
  
                                          <h4 class="pt-3">
                                              ${postTitle}
                                          </h4>
  
                                          <p>
                                              ${post.body}
                                          </p>
  
                                          <hr>
  
                                          <div>
                                              <span>
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                      class="bi bi-pen" viewBox="0 0 16 16">
                                                      <path
                                                          d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                                                  </svg>
                                                  (${post.comments_count}) comments
                                                  <span id="post-tags-${post.id}">
                                                      
                                                  </span>
                      
                                              </span>
                                          </div>
                                      </div>
                                  </div>
                                  `;
        document.getElementById("user-posts").innerHTML += content;

        const currentPostTagsId = `post-tags-${post.id}`;
        document.getElementById(currentPostTagsId).innerHTML = "";

        for (tag of post.tags) {
          let tagsContent = `
                              <button class="btn btn-sm rounded-5" style="background-color: gray; color: white;">
                                  ${tag.name}
                              </button>
                          `;
          document.getElementById(currentPostTagsId).innerHTML += tagsContent;
        }
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      toggleLoader(false);
    });
    
}
