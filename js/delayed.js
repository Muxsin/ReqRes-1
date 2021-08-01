let PAGE = 1;
let PER_PAGE = 3;
let usersList = document.querySelector('.users-list');
let userTemplate = document.querySelector('#user-template');
let pagination = document.querySelector('.pagination');
let per_page_selector = document.querySelector('#per_page_selector');
let per_page_set_btn = document.querySelector('#per_page_set_btn');

function getUsers(page = PAGE, per_page = PER_PAGE, delay = 3) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://reqres.in/api/users?delay=${delay}&page=${page}&per_page=${per_page}`);
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
    usersList.innerHTML = '<p style="text-align: center;"><img src="img/loading.gif" alt=""></p>';
    xhr.send();
}

getUsers();
