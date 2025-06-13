//#region host
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
                const regData = JSON.parse(HTTP_REQUEST.responseText);
                console.log(regData);

                if (regData.message && regData.Data && regData.Data.token) {
                    const token = regData.Data.token;
                    localStorage.setItem('_token', token);
                    console.log(token);

                    _load('/MODULES/messenger.html', function (responseText) {
                        CONTENT.innerHTML = responseText;
                    });
                } else {
                    console.error("Ошибка регистрации:", regData.message);
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
            const AuthData = JSON.parse(responseText);
            console.log(AuthData);

            if (AuthData.message && AuthData.Data && AuthData.Data.token) {
                const token = AuthData.Data.token;
                localStorage.setItem('_token', token);
                console.log(token);
                _load('/MODULES/messenger.html', function (responseText) {
                    CONTENT.innerHTML = responseText;
                    logout();
                    userChats();

                    document.querySelector('.btn_burger').addEventListener('click', function () {
                        document.querySelector('.nav').classList.toggle('hidden');
                    });

                    document.querySelector('.h2_mess_3').addEventListener('click', function () {
                        document.querySelector('.userData').classList.toggle('hidden');
                    })

                    document.querySelector('.h2_mess_4').addEventListener('click', function () {
                        window.open('/MODULES/dataChanges.html', '_self')
                    })
                    document.querySelector('.h2_mess_1').addEventListener('click', function () {
                        _load('/MODULES/auth.html', function (responseText) {
                            CONTENT.innerHTML = responseText;
                        })
                    });
                });
                
                function message() {
                    const mess_block = document.getElementById(mess_block);
                    const inputMessage = document.getElementById(inputMessage);
                    const btn_mess = document.getElementById(btn_mess);

                    btn_mess.addEventListener('click', () => {
                        const message = inputMessage.value.trim();
                        if (message) {
                            sendRequest(message);
                            inputMessage.value = '';
                        }
                    })

                    function sendRequest(message) {
                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', `${HOST}/chats/`);
                        xhr.setRequestHeader('Content-Type', 'application/json');

                        xhr.onload = () => {
                            if (xhr.status == 200) {
                                const response = JSON.parse(xhr.responseText);
                                const newMessageElement = document.createElement('div');
                                newMessageElement.textContent = response.message;
                                mess_block.appendChild(newMessageElement);
                            } else {
                                console.error('Error:', xhr.status, xhr.statusText);
                            }
                        };

                        xhr.onerror = () => {
                            console.error('Network error');
                        };
                    }
                }


            } else {
                console.error("Ошибка авторизации:", AuthData.message);
            }

            function mess() {
                let message = document.getElementById('messageInput').value;
                if (message.trim() === "") {
                    return;
                }

                let xhr = new XMLHttpRequest();
                xhr.open('POST', `${HOST}/chats/`);
                xhr.setRequestHeader("Content-type", "application/json");

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        let response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            displayMessage(message, true);
                        } else {
                            alert("Ошибка при отправке сообщения: " + response.message);
                        }
                    } else {
                        alert("Ошибка при отправке сообщения: статус " + xhr.status);
                    }
                };

                xhr.onerror = function () {
                    alert("Ошибка сети при отправке сообщения");
                };

                xhr.send(JSON.stringify({ message: message }));
                document.getElementById("messageInput").value = "";
            }

            function displayMessage(message, isSent) {
                const messagesContainer = document.getElementById('messages');

                const messageDiv = document.createElement('div');
                messageDiv.className = 'message_chat ' + (isSent ? 'sent' : 'received');

                const messageText = document.createElement('p');
                messageText.textContent = message;

                messageDiv.appendChild(messageText);
                messagesContainer.appendChild(messageDiv);
            }
        });
    });


    function userChats() {
        let HTTP_REQUEST = new XMLHttpRequest();
        HTTP_REQUEST.open('GET', `${HOST}/chats/`);
        HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
        HTTP_REQUEST.send();

        HTTP_REQUEST.onreadystatechange = function () {
            if (HTTP_REQUEST.readyState === 4) {
                if (HTTP_REQUEST.status === 200) {
                    let chatData = JSON.parse(HTTP_REQUEST.responseText);

                    chatData.forEach(element => {
                        let divChats = document.getElementById(`chat_${element.chat_id}`);
                        if (divChats) {
                            if (divChats.getAttribute('div') != element.chat_last_message) {
                                if (divChats._timerMsgChat) {
                                    clearInterval(divChats._timerMsgChat);
                                }
                                divChats._timerMsgChat = setInterval(() => {
                                    divChats.classList.toggle('users');
                                }, 500);
                            }
                        } else {
                            //  let newChatDiv = createdivChat(element);
                            //  document.querySelector('users').appendChild(newChatDiv);
                        }
                    });
                } else {
                    console.error('Ошибка при получении чатов:', HTTP_REQUEST.status);
                }
            }
        };
    }


    function createChat() {
        document.querySelector('.btn_create_chat').addEventListener('click', function () {
            let fdata = new FormData();
            fdata.append('email', document.querySelector('input[name = "email-work"]').value)
            let HTTP_REQUEST = new XMLHttpRequest();
            HTTP_REQUEST.open('POST', `${HOST}/chats/`);
            HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
            HTTP_REQUEST.send(fdata);
            HTTP_REQUEST.onreadystatechange = function () {
                if (HTTP_REQUEST.readyState == 4) {
                    localStorage.getItem('_token');
                    localStorage.getItem('_UserID');
                    createData = JSON.parse(HTTP_REQUEST.responseText);
                    userChats();
                    document.querySelector('users').append(userChats());
                    document.querySelector('input[name = "email-work"]').value = ''
                }
            }
        })
    }
}



//#region logout
function logout(url, token) {
    document.querySelector('.btn_header').addEventListener("click", function () {
        let fdata = new FormData();
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", url);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                localStorage.removeItem('_token');
                loadAuth();
            }
        }
        _load('/modules/auth.html', function (responseText) {
            loadAuth();
            const contentDiv = document.getElementById('CONTENT');
            if (contentDiv) {
                contentDiv.innerHTML = responseText;
            } else {
                CONTENT.innerHTML = responseText;
            }
            // xhr.send(fdata);
        });
    });
}
//#endregion


