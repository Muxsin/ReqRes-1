let PAGE = 1;
let PER_PAGE = 3;

let usersList = document.querySelector('.users-list');
let userTemplate = document.querySelector('#user-template');
let pagination = document.querySelector('.pagination');
let per_page_selector = document.querySelector('#per_page_selector');
let per_page_set_btn = document.querySelector('#per_page_set_btn');
let loged_in_user = document.querySelector('.loged_in_user');
let showBox = document.querySelector('.show-box');
let editBox = document.querySelector('.edit-box');
let logoutBtn = document.querySelector('.logout-btn');
let showUserEditBtn;


logoutBtn.addEventListener('click', () => {
    logoutUser();
})

function checkLogedIn() {
    if(localStorage.hasOwnProperty('token')) {
        getUserById(localStorage.token[localStorage.token.length - 1]);
        logoutBtn.classList.remove('hidden');
    }
}

checkLogedIn();

function getUserById(id) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://reqres.in/api/users/${id}`);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            let userData = JSON.parse(xhr.responseText).data;
            let userName = userData.first_name + " " + userData.last_name;
            let userEmail = userData.email;
            let userAvatar = userData.avatar;
            
            loged_in_user.innerHTML = `<img src="${userAvatar}" alt="avatar" class="loged-in-user-avatar">
                                    <p class="loged-in-user-name">${userName}</p>`;
        }
    }
    xhr.send();
}

function logoutUser() {
    localStorage.removeItem('token');
    loged_in_user.innerHTML = "";
    logoutBtn.classList.toggle('hidden');
}

function removeDeletedUsersFromLocalStorage() {
    localStorage.removeItem('deletedUsers');
}

function filterPerPage() {
    PER_PAGE = per_page_selector.value;
    getUsers();
}

function changePage(page) {
    PAGE = page;
    getUsers();
}

function moveToLastPage() {
    let lastPageText = document.getElementsByClassName('page');
    PAGE = lastPageText[lastPageText.length - 2].innerText;
    getUsers();
}

function moveToFirstPage() {
    let lastPageText = document.getElementsByClassName('page');
    PAGE = lastPageText[1].innerText;
    getUsers();
}

// let a = document.importNode(userTemplate.content, true);

function getUsers(page = PAGE, per_page = PER_PAGE) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://reqres.in/api/users?page=${page}&per_page=${per_page}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            let totalPages = JSON.parse(xhr.responseText).total_pages;
            let UsersData = JSON.parse(xhr.responseText).data;
            pagination.innerHTML = "";
            for(let page = 1; page <= totalPages; page++) {
                pagination.innerHTML += `<li><button class="page" onclick="changePage(parseInt(this.innerText))">${page}</button></li>`;
            } 
            usersList.innerHTML = '';
            for(let data of UsersData) {
                let deleted_users = JSON.parse(localStorage.getItem("deletedUsers"));
                if(deleted_users != null) {
                    if(!deleted_users.includes(data.id)) {
                        let user = document.importNode(userTemplate.content, true);
                        user.querySelector('.user-id').innerText = data.id;
                        user.querySelector('.user-name').innerText = data.first_name + " " + data.last_name;
                        user.querySelector('.user-email').innerText = data.email;
                        user.querySelector('.loged-in-user-avatar').src = data.avatar;
                        usersList.appendChild(user); 
                    }
                } else {
                    let user = document.importNode(userTemplate.content, true);
                    user.querySelector('.user-id').innerText = data.id;
                    user.querySelector('.user-name').innerText = data.first_name + " " + data.last_name;
                    user.querySelector('.user-email').innerText = data.email;
                    user.querySelector('.loged-in-user-avatar').src = data.avatar;
                    usersList.appendChild(user); 
                }
            }
        }
    }
    xhr.send();
}

getUsers();

function getUserbyElement(elem) {
    let user_id = elem.parentNode.parentNode.querySelector('.user-id').innerText;
    
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://reqres.in/api/users/${user_id}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            let userData = JSON.parse(xhr.responseText).data;
            let userName = userData.first_name + " " + userData.last_name;
            let userEmail = userData.email;
            let userAvatar = userData.avatar;
            showBox.innerHTML = `<img src="${userAvatar}" alt="avatar" class="show-user-avatar">
                                <div class="show-user-name">${userName}</div>
                                <div class="show-user-email">${userEmail}</div>
                                <div class=""><button class="delete-btn">Delete</button></div>`;
            showBox.querySelector('.delete-btn').onclick = () => {
                if(!localStorage.hasOwnProperty('deletedUsers')) {
                    localStorage.setItem('deletedUsers', "");
                } else {
                    if(localStorage.getItem("deletedUsers") == "") {
                        localStorage.deletedUsers = JSON.stringify([userData.id]);
                    } else {
                        let deleted_users = JSON.parse(localStorage.getItem("deletedUsers"));
                        if(!deleted_users.includes(userData.id)) {
                            deleted_users[deleted_users.length] = userData.id;
                            localStorage.setItem("deletedUsers", JSON.stringify(deleted_users));
                        }
                    }
                }
            }
            
        }
    }
    xhr.send();
}

let userCreateBtn = document.querySelector('.user-create-btn');

function createUser() {
    let createUserNameValue = document.querySelector('.create-user-name').value;
    let createUserJobValue = document.querySelector('.create-user-job').value;
    let createUpdateError = document.querySelector('.create_update_error');
    createUpdateError.innerText = "";

    if(createUserNameValue === "" || createUserJobValue === "") {
        createUpdateError.innerText = "Fields can't be empty!";
    } else {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', "https://reqres.in/api/users", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 201) {
                let ResData = JSON.parse(xhr.responseText);
                showBox.innerHTML = `<div class="show-user-name">Id: ${ResData.id}</div>
                                    <div class="show-user-email">Created at: ${ResData.createdAt}</div>`;
            }
        }
        xhr.send(`{"name":"${createUserNameValue}", "job":"${createUserJobValue}"}`);
    }
}

function updateUser(user = 1) {
    let createUserNameValue = document.querySelector('.create-user-name').value;
    let createUserJobValue = document.querySelector('.create-user-job').value;
    let createUpdateError = document.querySelector('.create_update_error');
    createUpdateError.innerText = "";

    if(createUserNameValue === "" || createUserJobValue === "") {
        createUpdateError.innerText = "Fields can't be empty!";
    } else {
        let xhr = new XMLHttpRequest();
        xhr.open("PUT", `https://reqres.in/api/users/${user}`);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200) {
                let ResData = JSON.parse(xhr.responseText);
                showBox.innerHTML = `<div class="show-user-email">Updated at: ${ResData.updatedAt}</div>`;
            }
        }
        xhr.send();
    }
}

function registerUser() {
    let loginRegisterEmail = document.querySelector('.login_register-email').value;
    let loginRegisterPassword = document.querySelector('.login_register-password').value;
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            let ResData = JSON.parse(xhr.responseText);
            showBox.innerHTML = `<div class="show-user-name">Id: ${ResData.id}</div>
                                <div class="show-user-email">Token: ${ResData.token}</div>`;
        } else if (xhr.readyState === 4 && xhr.status === 400) {
            let ResData = JSON.parse(xhr.responseText);
            showBox.innerHTML = `<div class="show-user-name">Error: ${ResData.error}</div>`;
        }
    }
    xhr.open("POST", "https://reqres.in/api/register", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        `{"email":"${loginRegisterEmail}","password":"${loginRegisterPassword}"}`
    );
}

function loginUser() {
    let loginRegisterEmail = document.querySelector('.login_register-email').value;
    let loginRegisterPassword = document.querySelector('.login_register-password').value;
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            let ResData = JSON.parse(xhr.responseText);
            showBox.innerHTML = `<div class="show-user-email">Token: ${ResData.token}</div>`;
            localStorage.setItem('token', ResData.token);
            getUserById(ResData.token[ResData.token.length - 1]);
            logoutBtn.classList.remove('hidden');
        } else if (xhr.readyState === 4 && xhr.status === 400) {
            let ResData = JSON.parse(xhr.responseText);
            showBox.innerHTML = `<div class="show-user-name">Error: ${ResData.error}</div>`;
        }
    }
    xhr.open("POST", "https://reqres.in/api/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
        `{"email":"${loginRegisterEmail}","password":"${loginRegisterPassword}"}`
    );
}


function refreshAll() {
    removeDeletedUsersFromLocalStorage();
    logoutUser();
}