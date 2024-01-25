
function getRepositories() {
    const username = document.getElementById('username').value;
    const perPage = document.getElementById('perPage').value;
    const userApiUrl = `https://api.github.com/users/${username}`;
    const repositoriesApiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}`;

   
    document.getElementById('loader').classList.remove('d-none');

    fetch(userApiUrl)
        .then(response => response.json())
        .then(user => {
         
            displayUserInfo(user);

            return fetch(repositoriesApiUrl);
        })
        .then(response => response.json())
        .then(repositories => {
        
            document.getElementById('loader').classList.add('d-none');

            displayRepositories(repositories);
        })
        .catch(error => console.error('Error fetching data:', error));

        perPageContainer.classList.remove('d-none');
}


function displayUserInfo(user) {
    const userInfoElement = document.getElementById('user-info');
    const userAvatarElement = document.getElementById('user-avatar');

    const userInfoContainer = document.createElement('div');
    userInfoContainer.className = 'd-flex align-items-center';

    const avatarContainer = document.createElement('div');
    avatarContainer.style.marginRight = '20px'; 
    avatarContainer.style.marginLeft = '30px'; 

    userAvatarElement.src = user.avatar_url;
    avatarContainer.appendChild(userAvatarElement);

    const userDetailsContainer = document.createElement('div');

    const userNameElement = document.createElement('p');
    userNameElement.textContent = `${user.login}`;
    userNameElement.style.fontWeight = 'bold'; 

    const locationElement = document.createElement('p');
    locationElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${user.location || 'Not specified'}`;
    locationElement.style.fontSize = '0.6em';

    const bioElement = document.createElement('p');
    bioElement.textContent = `${user.bio || 'Not available'}`;
    bioElement.style.fontSize = '0.6em';


    userDetailsContainer.appendChild(userNameElement);
    userDetailsContainer.appendChild(bioElement);
    userDetailsContainer.appendChild(locationElement);
  

    userInfoContainer.appendChild(avatarContainer);
    userInfoContainer.appendChild(userDetailsContainer);

    userInfoElement.innerHTML = '';
    userInfoElement.appendChild(userInfoContainer);

    userInfoElement.classList.remove('d-none');
    userAvatarElement.classList.remove('d-none');
}

function displayRepositories(repositories, currentPage) {
    const repositoriesContainer = document.getElementById('repositories');
    repositoriesContainer.innerHTML = '';

    if (repositories.length === 0) {
        repositoriesContainer.innerHTML = '<p>No repositories found.</p>';
        return;
    }

    repositories.forEach((repository, index) => {
        const repositoryElement = document.createElement('div');
        repositoryElement.className = 'card mt-2 repository-card';
        repositoryElement.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${repository.name}</h5>
                <p class="card-text">${repository.description || 'No description available.'}</p>
                <p class="card-text">${repository.topics.join(', ') || 'No topics'}</p>
                <p class="card-text1">${repository.language || 'Not specified'}</p>
            </div>
        `;

        repositoryElement.id = `repository-${index + 1}`;

        repositoriesContainer.appendChild(repositoryElement);
    });

    addPagination(repositories.length, currentPage);
}

function addPagination(totalRepositories, currentPage, perPage) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalRepositories / perPage);

    const pageButtonsContainer = document.createElement('div');
    pageButtonsContainer.style.display = 'flex';
    pageButtonsContainer.style.justifyContent = 'center';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = 'btn btn-outline-primary mr-2';
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => goToPage(i));
        pageButtonsContainer.appendChild(pageButton);
    }

    paginationContainer.appendChild(pageButtonsContainer);

    document.getElementById('perPage').value = perPage;
}


function goToPage(pageNumber) {
    const username = document.getElementById('username').value;
    const perPage = document.getElementById('perPage').value;
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${pageNumber}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loader').classList.add('d-none');

            displayRepositories(data, pageNumber, perPage);
        })
        .catch(error => console.error('Error fetching data:', error));
}