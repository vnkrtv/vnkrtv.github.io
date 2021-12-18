function getProjectDiv(project, lang) {
    let projectRef = (project.ref !== undefined) ?
        `<li class="list-inline-item">
            <a href="${project.ref}"><img src="image/icons/ref.svg"></a>
         </li>` : '';
    let tags = '';
    for (let tag of project.tags) {
        tags += `<span class="badge badge-dark">${tag}</span>&nbsp;`;
    }

    let projectDiv = document.createElement('div');
    projectDiv.className = "col-xs-12 col-sm-6 col-md-4";
    projectDiv.innerHTML = `
                <div class="image-flip">
                    <div class="mainflip flip-0">
                        <div class="frontside">
                            <div class="card">
                                <div class="card-body text-center">
                                    <p><img class=" img-fluid" src="${project.image}"
                                            alt="card image"></p>
                                    <h4 class="card-title">${project.name}</h4>
                                    <p class="card-text">${project.front_description}</p>
                                </div>
                            </div>
                        </div>
                        <div class="backside" onclick="">
                            <div class="card">
                                <div class="card-body text-center mt-4">
                                    <h4 class="card-title">${lang === 'En' ? 'Description' : 'Описание'}</h4>
                                    <div class="card-text">
                                        <p>${project.back_description}</p>
                                        <p>
                                            ${tags}
                                        </p>
                                    </div>
                                    <ul class="list-inline">
                                        <li class="list-inline-item">
                                            <a href="https://github.com/vnkrtv/${project.github_name}">
                                                <img src="image/icons/github.svg">
                                            </a>
                                        </li>
                                        ${projectRef}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
    return projectDiv;
}

async function fetchProjects(lang) {
    return await fetch(`data/${lang}/projects.json`)
        .then(res => res.json())
    ;
}

async function fetchMainSiteData(lang) {
    return await fetch(`data/${lang}/main_data.json`)
        .then(res => res.json())
    ;
}

function fillMainSiteData(mainData) {
    const lang = getLang();

    document.getElementById('main-link').innerHTML = lang === 'En' ? 'About' : 'Обо мне';
    for (let el of document.getElementsByClassName('projects-text')) {
        el.innerHTML = lang === 'En' ? 'Projects' : 'Проекты';
    }
    for (let el of document.getElementsByClassName('contacts-text')) {
        el.innerHTML = lang === 'En' ? 'Contacts' : 'Контакты';
    }

    document.getElementById('mainInfo').innerHTML = mainData['mainInfo'];

    document.getElementById('footer').innerHTML = mainData['footer'];
}

function renderProjects(projects, lang) {
    const projectsDiv = document.getElementById('projectsDiv');
    projectsDiv.innerHTML = '';
    for (let project of projects) {
        const projectDiv = getProjectDiv(project, lang);
        projectsDiv.appendChild(projectDiv);
    }
}

function getLang() {
    return document.getElementById('lang').innerHTML;
}

function setLang(lang) {
    document.getElementById('lang').innerHTML = lang;
}

async function renderPage() {
    const lang = getLang();
    const projects = await fetchProjects(lang);
    const mainData = await fetchMainSiteData(lang);
    renderProjects(projects, lang);
    fillMainSiteData(mainData);
}

function switchLang() {
    if (getLang() === 'Ru') {
        setLang('En');
    } else {
        setLang('Ru');
    }
    renderPage();
}



function getTags(projects) {
    let tags = {};
    for (let project of projects) {
        for (let tag of project.tags) {
            if (tags[tag] !== undefined) {
                tags[tag]++;
            } else {
                tags[tag] = 1;
            }
        }
    }
    return Object.entries(tags)
        .sort(([, a], [, b]) => b - a)
        .map((tag) => {
            return {'tag': tag[0], 'count': tag[1]}
        });
}
