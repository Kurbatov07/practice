//#region 
const HOST = ` http://api-messenger.web-srv.local`;
const CONTENT = document.querySelector(`.content`);
var TOKEN = ``
//#endregion

//#region AUTH
loadPageAuth();
    function loadPageAuth() {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/modules/auth.html");
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                CONTENT.innerHTML = xhr.responseText
                onLoadPageAuth()
            }
        }
    }


    function onLoadPageAuth() {
        document.querySelector (".btn_auth_1").addEventListener('click',function(){
            let fdata =new FormData();
            fdata.append("Name",document.querySelector('input[name="Name"]').value);
            fdata.append("First_name",document.querySelector('input[name="First_name"]').value);
            fdata.append("Number",document.querySelector('input[name="Number"]').value);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", '${HOST}/auth.html');
            xhr.send(fdata);
            xhr.onreadystatechange = function() {
                if (xhr.readyState ==4) {
                    console.log(this.responseText);
                    if (xhr.status == 200);
                }
            }
        })
    }