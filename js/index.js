function getJSON(url) {
    let request = new XMLHttpRequest();
    let response;
    request.open('GET', url, false);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            response = JSON.parse(request.responseText);
        } else {
            console.log(`Error on '${url}' request - status:` + request.status);
        }
    };
    request.send();
    return response;
}

function getProjectDiv(project) {
    let projectRef = (project.ref !== undefined) ?
        '<li className="list-inline-item">' +
        '<a href="{{ project.ref }}"><img src="image/icons/ref.svg"></a>' +
        '</li>' : '';
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
                                    <h4 class="card-title">Description</h4>
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

function renderProjects(projects) {
    const projectsDiv = document.getElementById('projectsDiv');
    for (let project of projects) {
        const projectDiv = getProjectDiv(project);
        projectsDiv.appendChild(projectDiv);
    }
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