//#region 
const HOST = `http://api-messenger.web-srv.local`;
const CONTENT = document.querySelector(`.content`);
var TOKEN = ``;
//#endregion

//#region combain

function _del() {
    let HTTP_REQUEST = new XMLHttpRequest()
    HTTP_REQUEST.open('DELETE', params.url)
    HTTP_REQUEST.send()
    HTTP_REQUEST.onreadystatechange = function () {
        if (HTTP_REQUEST.readyState == 4) {
            callback(HTTP_REQUEST.responseText)
        }
    }
}

function _get(params, callback) {
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('GET', params.url)
    HTTP_REQUEST.send()
    HTTP_REQUEST.onreadystatechange = function () {
        if (HTTP_REQUEST.readyState == 4) {
            callback(HTTP_REQUEST.responseText)
        }
    };
}

function _elem(selector) {
    return document.querySelector(selector)
}

function _post(params, callback) {
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('POST', params.url)
    HTTP_REQUEST.send(params.data)

    HTTP_REQUEST.onreadystatechange = function () {
        if (HTTP_REQUEST.readyState == 4) {
            callback(HTTP_REQUEST.responseText)
        }
    }
}

function _load(url, callback) {
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('GET', url);
    HTTP_REQUEST.send();

    HTTP_REQUEST.onreadystatechange = function () {
        if (HTTP_REQUEST.readyState == 4) {
            if (callback) {
                callback(HTTP_REQUEST.responseText)
            }
        }
    }
}

//#endregion

//#region auth
loadAuth();
function loadAuth() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/modules/auth.html");
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            CONTENT.innerHTML = xhr.responseText;
            onLoadAuth();
            document.querySelector(".btn_regist_1").addEventListener('click', function () {
                _load('/MODULES/registration.html', function (responseText) {
                    CONTENT.innerHTML = responseText;
                    regist();
                })
            })
        }
    }
}
//#endregion

//#region registration
function regist() {
    Registration();
}

function Registration() {
    document.querySelector('.btn_regist').addEventListener('click', function () {
        let fdata = new FormData();

        fdata.append('fam', document.querySelector('input[name="First_name"]').value);
        fdata.append('name', document.querySelector('input[name="Name"]').value);
        fdata.append('otch', document.querySelector('input[name="Otch"]').value);
        fdata.append('email', document.querySelector('input[name="Email"]').value);
        fdata.append('pass', document.querySelector('input[name="Password"]').value);

        let HTTP_REQUEST = new XMLHttpRequest();
        HTTP_REQUEST.open('POST', `${HOST}/user/`);
        HTTP_REQUEST.send(fdata);

        HTTP_REQUEST.onreadystatechange = function () {
            if (HTTP_REQUEST.readyState === 4) {
                regData = JSON.parse(HTTP_REQUEST.responseText);
                console.log(regData);

                if (regData.message) {
                    let token = regData.Data.token;
                    localStorage.setItem('_token', token);
                    console.log(token);

                    _load('/MODULES/registration.html', function (responseText) {
                        CONTENT.innerHTML = responseText;
                    });
                }
            }
        };
    });
}
//#endregion

//#region messenger
function onLoadAuth() {
    document.querySelector(".btn_auth_1").addEventListener('click', function () {
        let fdata = new FormData();
        fdata.append("email", document.querySelector('input[name="Email"]').value);
        fdata.append("pass", document.querySelector('input[name="Pass"]').value);

        _post({ url: `${HOST}/auth/`, data: fdata }, function (responseText) {
            AuthData = JSON.parse(responseText);
            console.log(AuthData);

            if (AuthData.message) {
                token = AuthData.Data.token
                console.log(token);
                _load('/MODULES/messenger.html', function (responseText) {
                    CONTENT.innerHTML = responseText;
                })
            }
        })
    });
}
//#endregion


//#region logout
function logout() {
    const btnHeader = document.querySelector('.btn_header');
    if (btnHeader) {
        btnHeader.addEventListener('click', function () {
            let fdata = new FormData();
            fdata.append("token", TOKEN);

            fetch(`${HOST}/auth/`, {
                method: 'POST',
                body: fdata
            })
                .then(response => response.json())
                .then(AuthData => {
                    if (AuthData.message || AuthData.success) {
                        TOKEN = null;

                        _load('/MODULES/auth.html', function (responseText) {
                            CONTENT.innerHTML = responseText;
                        });
                    } else {
                        console.error('Ошибка выхода:', AuthData);
                    }
                })
                .catch(error => console.error('Ошибка при запросе:', error));
        });
    }
}
logout();