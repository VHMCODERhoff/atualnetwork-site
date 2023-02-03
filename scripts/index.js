window.onload = function () {
    getArticle();
}

const getArticle = () => {
    fetch('http://api-atualnetwork.us-3.evennode.com/', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                document.querySelector('#article').innerHTML += `
                    ${element.type === 'title' ? `
                    <div class="title">
                    <h1>${element.content}</h1>
                    </div>` : ''}

                    ${element.type === 'paragraph' ? `
                    <div class="content_description">
                    <p id="paragraphArticle" data="${element.id}">${element.content}</p>
                    </div>` : ``}

                    ${element.type === 'img' ? `
                    <div class="content_image">
                    <img id="imageArticle" data="${element.id}" src="http://api-atualnetwork.us-3.evennode.com/${element.content}" alt="imageAtualTeste">
                    </div>` : ``}

                    ${element.type === 'line' ? ` 
                    <div id="lineArticle" data="${element.id}" class="content_line">
                    <hr>
                    </div>
                    ` : ''}
                `
            });
            document.querySelector('#article').innerHTML += `

            <div class="modalParagraph">
                <div class="modal_container">
                    <div class="menu_item" style="margin-bottom: -5px;">
                            <label class="menu_item_text">Insira o Paragráfo</label>
                            <div >
                            <input class="input" type="text" id="paragraph" name="paragraph" placeholder="">
                            </div>

                            <div class="divBtn_modal">
                            <button class="modalCancel_btn" onclick="OpenParagrah()" class="button_add">Fechar</button>
                            <button class="modalAdd_btn" onclick="UpdateParagraph()" class="button_add">Adicionar</button>
                            </div>
                    </div>
                </div>
           </div>

         
            
            <div class="container_buttons">
            <div class="modal">
            <div class="modal_container">
            <div class="menu_item" style="margin-bottom: -5px;">
                    <label class="menu_item_text">Text</label>
                </div>
                <div class="menu_item">
                    <div onclick="OpenParagrah()" class="sub_item">
                        <div class="border_icon">
                            <img class="folder_icon" src="./assets/icons/text.svg" alt="logo">
                        </div>
                        <div  class="sub_item_content">
                            <label class="menu_item_text">Paragráfo</label>
                            <p class="menu_item_description">Adicione um paragráfo ao texto</p>
                        </div>
                    </div>
                </div>
                <hr size="1" width="100%">
                <div class="menu_item" style="margin-bottom: -5px;">
                    <label class="menu_item_text">Basic</label>
                </div>
                <div class="menu_item">
                    <div onclick="UploadImage()" class="sub_item">
                    <input type="file" id="upload" style="display:none">
                        <div class="border_icon">
                            <img class="folder_icon" src="./assets/icons/image.svg" alt="logo">
                        </div>
                        <div class="sub_item_content">
                            <label class="menu_item_text">Imagem</label>
                            <p class="menu_item_description">Envie uma imagem</p>
                        </div>
                    </div>
                </div>
                <div class="menu_item">
                    <div  onclick="AddLine()" class="sub_item">
                        <div class="border_icon">
                   
                            <img class="folder_icon" src="./assets/icons/separator.svg" alt="logo">
                        </div>
                        <div class="sub_item_content">
                            <label class="menu_item_text">Separador</label>
                            <p class="menu_item_description">Cria uma linha</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                <div id="btnAdd" class="button_actions">
                 <button onclick="OpenModal()" class="button_add">Clique para adicionar um novo elemento</button>
                </div>
            </div>
            `
        })
}


const UpdateParagraph = () => {
    const paragraph = document.querySelector('#paragraph').value;
    const id = document.querySelector('#paragraphArticle').getAttribute('data');

    if (document.querySelector('.modalParagraph').classList.contains('activeParagraph')) {
        document.querySelector('.modalParagraph').classList.remove('activeParagraph');
    }

    fetch(`http://api-atualnetwork.us-3.evennode.com/api/updateArticle?id=${id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify({
            type: 'paragraph',
            content: paragraph
        })
    }).then(response => {
        if (response.status === 200) {
            document.querySelector('#article').innerHTML = '';
            getArticle();
        } else {
            response.json().then(data => {
                alert(data.message);
            })
        }
    })
}

const AddLine = () => {
    const id = document.querySelector('#lineArticle').getAttribute('data');
    fetch(`http://api-atualnetwork.us-3.evennode.com/api/updateArticle?id=${id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify({
            type: 'line',
            content: ''
        })
    }).then(response => {
        if (response.status === 200) {
            document.querySelector('#article').innerHTML = '';
            getArticle();
        } else {
            response.json().then(data => {
                alert(data.message);
            })
        }
    })
}

const UploadImage = () => {
    const id = document.querySelector('#imageArticle').getAttribute('data');
    document.querySelector('#upload').click();
    document.querySelector('#upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        fetch(`http://api-atualnetwork.us-3.evennode.com/api/uploadImage`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    fetch(`http://api-atualnetwork.us-3.evennode.com/api/updateArticle?id=${id}`, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: 'PUT',
                        body: JSON.stringify({
                            type: 'img',
                            content: data.filename
                        })
                    }).then(response => {
                        if (response.status === 200) {
                            document.querySelector('#article').innerHTML = '';
                          window.location.reload();
                           
                        } else {
                            response.json().then(data => {
                                alert(data.message);
                            })
                        }
                    })
                })
            } else {
                response.json().then(data => {
                    alert(data.message);
                })
            }
        })
    })
}

const OpenModal = () => {
    if (document.querySelector('.modal').classList.contains('active')) {
        document.querySelector('.modal').classList.remove('active');
    } else {
        document.querySelector('.modal').classList.add('active');
    }
}

const OpenParagrah = () => {
    if (document.querySelector('.modal').classList.contains('active')) {
        document.querySelector('.modal').classList.remove('active');
    }
    if (document.querySelector('.modalParagraph').classList.contains('activeParagraph')) {
        document.querySelector('.modalParagraph').classList.remove('activeParagraph');
    } else {
        document.querySelector('.modalParagraph').classList.add('activeParagraph');
    }
}
