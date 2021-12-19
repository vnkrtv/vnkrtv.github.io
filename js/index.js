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

async function fetchProjects() {
    return await fetch(`data/projects.json`)
        .then(res => res.json())
    ;
}

async function fetchMainSiteData() {
    return await fetch(`data/main_data.json`)
        .then(res => res.json())
    ;
}

async function fetchData() {
    projects = await fetchProjects();
    mainData = await fetchMainSiteData();
}

function fillMainSiteData(mainInfoData) {
    const lang = getLang();

    document.getElementById('main-link').innerHTML = lang === 'En' ? 'About' : 'Обо мне';
    for (let el of document.getElementsByClassName('projects-text')) {
        el.innerHTML = lang === 'En' ? 'Projects' : 'Проекты';
    }
    for (let el of document.getElementsByClassName('contacts-text')) {
        el.innerHTML = lang === 'En' ? 'Contacts' : 'Контакты';
    }

    document.getElementById('mainInfo').innerHTML = mainInfoData['mainInfo'];

    document.getElementById('footer').innerHTML = mainInfoData['footer'];
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

function renderPage() {
    const lang = getLang();
    const curProjects = projects[lang];
    const mainInfoData = mainData[lang];
    renderProjects(curProjects, lang);
    fillMainSiteData(mainInfoData);
}

function switchLang() {
    if (getLang() === 'Ru') {
        setLang('En');
    } else {
        setLang('Ru');
    }
    filterProjectsByTags();
}

function toggleTag(tagId) {
    const tagSpan = document.getElementById(tagId);
    if (tagSpan.classList.contains('active-tag')) {
        tagSpan.classList.remove('active-tag');
        tagSpan.classList.remove('badge-dark');
        tagSpan.classList.add('badge-light');
    } else {
        tagSpan.classList.remove('badge-light');
        tagSpan.classList.add('badge-dark');
        tagSpan.classList.add('active-tag');
    }
    filterProjectsByTags();
}

function getTag(tag) {
    const tagSpan = document.createElement('span');
    tagSpan.id = `tag-${tag}`;
    tagSpan.style.cursor = "pointer";
    tagSpan.style.marginLeft = "1vh";
    if (tag === 'all') {
        tagSpan.className = "badge badge-dark active-tag";
    } else {
        tagSpan.className = "badge badge-light";
    }
    tagSpan.innerHTML = tag;
    tagSpan.setAttribute('onclick', `toggleTag("tag-${tag}")`);

    return tagSpan;
}

function renderTags(tags) {
    const tagsDiv = document.getElementById('tags-div');
    tagsDiv.innerHTML = '';

    for (let tag of tags) {
        tagsDiv.appendChild(getTag(tag));
    }
}

function filterProjectsByTags() {
    const lang = getLang();
    let activeTagsSnaps = document.getElementsByClassName('active-tag');
    let activeTags = new Set();
    for (const tagSnap of activeTagsSnaps) {
        activeTags.add(tagSnap.innerText);
    }

    if (activeTags.has('all')) {
        renderProjects(projects[lang], getLang());
        return;
    }

    let filteredProjects = projects[lang].filter(pr => {
        let projectsTags = new Set(pr['tags']);
        let tagsIntersection = new Set([...activeTags].filter(tag => projectsTags.has(tag)));
        return tagsIntersection.size;
    });
    renderProjects(filteredProjects, getLang());
}

// function getTags(projects) {
//     let tags = {};
//     for (let project of projects) {
//         for (let tag of project.tags) {
//             if (tags[tag] !== undefined) {
//                 tags[tag]++;
//             } else {
//                 tags[tag] = 1;
//             }
//         }
//     }
//     return Object.entries(tags)
//         .sort(([, a], [, b]) => b - a)
//         .map((tag) => {
//             return {'tag': tag[0], 'count': tag[1]}
//         });
// }
