let PAGE = 1;
let PER_PAGE = 3;

let resourceList = document.querySelector('.resources-list');
let resourceTemplate = document.querySelector('#resource-template');
let pagination = document.querySelector('.pagination');
let per_page_selector = document.querySelector('#per_page_selector');
let per_page_set_btn = document.querySelector('#per_page_set_btn');
let loged_in_user = document.querySelector('.loged_in_user');
let showBox = document.querySelector('.show-box');
let editBox = document.querySelector('.edit-box');
let logoutBtn = document.querySelector('.logout-btn');
let showUserEditBtn;

function filterPerPage() {
    PER_PAGE = per_page_selector.value;
    getResources();
}

function changePage(page) {
    PAGE = page;
    getResources();
}

function moveToLastPage() {
    let lastPageText = document.getElementsByClassName('page');
    PAGE = lastPageText[lastPageText.length - 2].innerText;
    getResources();
}

function moveToFirstPage() {
    let lastPageText = document.getElementsByClassName('page');
    PAGE = lastPageText[1].innerText;
    getResources();
}

function getResourceByElement(elem) {
    let resource_id = elem.parentNode.parentNode.querySelector('.resource-id').innerText;
    
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://reqres.in/api/unknown/${resource_id}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            let resourceData = JSON.parse(xhr.responseText).data;
            showBox.innerHTML = `<div class="show-user-color" style="background-color: ${resourceData.color}"></div>
                                <div class="show-user-name"><b>Name:</b> ${resourceData.name}</div>
                                <div class="show-user-email"><b>Year:</b> ${resourceData.year}</div>
                                <div class="show-user-email"><b>Color:</b> ${resourceData.color}</div>
                                <div class="show-user-email"><b>Pantone value:</b> ${resourceData.pantone_value}</div>`;
        }
    }
    xhr.send();
}

function getResources(page = PAGE, per_page = PER_PAGE) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://reqres.in/api/unknown?page=${page}&per_page=${per_page}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200) {
            let totalPages = JSON.parse(xhr.responseText).total_pages;
            let resourceData = JSON.parse(xhr.responseText).data;
            pagination.innerHTML = "";
            resourceList.innerHTML = '';
            for(let page = 1; page <= totalPages; page++) {
                pagination.innerHTML += `<li><button class="page" onclick="changePage(parseInt(this.innerText))">${page}</button></li>`;
            }

            for(let data of resourceData) {
                let resource = document.importNode(resourceTemplate.content, true);
                resource.querySelector('.resource-id').innerText = data.id;
                resource.querySelector('.resource-name').innerText = data.name;
                resource.querySelector('.resource-year').innerText = data.year;
                resource.querySelector('.resource-color-hex').innerText = data.color;
                resource.querySelector('.resource-color-box').style.backgroundColor = data.color;
                resource.querySelector('.resource-pantone-value').innerText = data.pantone_value;
                resourceList.appendChild(resource); 
            }
            
        }
    }
    xhr.send();
}

getResources();
