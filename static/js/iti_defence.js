var data_files = new DataTransfer();

window.onload = function () {
    inIframe();
};
// функция для скрытия шапки если окно внутри фрейма
function inIframe() {
    try {
        if (window.self !== window.top) {
            navbar = document.querySelector('.navbar');
            navbar.style.display = 'none';
        }
    } catch (e) {

    }
};

TaskAreaChoise(document.getElementById('task_area'));
TaskInternalChoise(document.getElementById('task_internal'));
CertTypeChoise(document.getElementById('cert_type'));

function TaskAreaChoise(task_area) {
    let checked;
    var formControlElements = document.querySelectorAll('.form-control');  // Выбираем все элементы с классом 'form-control'
    var classes = Array.from(formControlElements).map(function (element) {
        return Array.from(element.classList);  // Получаем классы каждого элемента и преобразуем их в массив
    });
    classes.forEach(function (classArray) {
        classArray.forEach(function (className) {
            ReqClasses(className, false);
            // Вызываем ReqClasses('значение', false) для каждого класса
        });
    });

    ClearFiles();
    uploadedFileNames = []
    data_files = new DataTransfer();
    console.log('FILES CLEARED')
    // console.log('data_files = \n', data_files)
    // console.log('uploadedFileNames = \n', uploadedFileNames)
    // console.log('fileInput.files = \n', fileInput.files)

    //    $('#send').removeClass('hidden');
    HideUnhide(true, 'send', '');
    HideUnhide(true, '', 'form_request');

    BlockUnblock('special_request', false);
    $('#special_request').prop('checked', false);

    BlockUnblock('auto_request', false);
    $('#auto_request').prop('checked', false);

    BlockUnblock('form_request', false);
    $('#form_request').prop('checked', false);

    all_radio = task_area.querySelectorAll('input');

    ReqClasses('SSL_DV', false);

    // task_internal = document.getElementById('task_internal')
    all_in = document.querySelectorAll('#task_internal input');
    all_in.forEach((item) => {
        item.checked = false;
        HideUnhide(true, '', item.value);
        ReqClasses(item.value + "_req", false);
    });

    cert_radio = cert_type.querySelectorAll('input');
    cert_radio.forEach((item) => {
        item.checked = false;
        HideUnhide(true, '', item.value);
        ReqClasses(item.value + "_req", false);
    });

    all_radio.forEach((item) => {
        if (item.checked) {
            HideUnhide(false, item.value);
            HideUnhide(true, 'send', '');
            ReqClasses(item.value + "_req", true);
            ReqClasses(item.value + "_req_secondary", false);
            document.getElementById('send').hidden = false;

            CheckFiles();
            if (item.value == 'KON') {
                HideUnhide(true, 'IN', '');
                HideUnhide(true, 'EXT', '');
                HideUnhide(false, 'send', '');
                $('#send').removeClass('btn-secondary').addClass('btn-success');
                $('#send').prop('disabled', false);
                ReqClasses(item.value + "_req", true);
            }
            else {
                HideUnhide(true, 'send', '');
            }
        }

        else {
            HideUnhide(true, item.value);
        }
    });
}

function TaskInternalChoise(task_internal) {
    // let checked;

    BlockUnblock('special_request', false);
    BlockUnblock('auto_request', false);
    BlockUnblock('form_request', false);
    $('.special_request').each(function () {
        this.checked = false;
    });
    $('.auto_request').each(function () {
        this.checked = false;
    });
    $('.form_request').each(function () {
        this.checked = false;
    });
    $('.file_in').each(function () {
        this.hidden = false;
    });
    $('.form_request_req').each(function () {
        this.hidden = true;
    });

    all_in = task_internal.querySelectorAll('input');
    all_in.forEach((item) => {
        HideUnhide(true, '', item.value);
        HideUnhide(true, item.value, '');
        HideUnhide(true, '', 'form_request');
        HideUnhide(true, '', 'form_request_req');

        ReqClasses(item.value + "_req", false);
    });
    all_in.forEach((item) => {
        if (item.checked) {
            ReqClasses(item.value + "_req", true);
            ReqClasses(item.value + "_req_secondary", false);
            CheckFiles();
            HideUnhide(false, 'send', '');
            if (item.value == 'NEW_IN') {
                HideUnhide(false, 'NEW_IN', '');
                HideUnhide(false, '', 'NEW_IN');
            }
            else if (item.value == 'NEW_OLD') {
                HideUnhide(false, 'NEW_OLD', '');
                HideUnhide(false, '', 'NEW_OLD');
            }
            else if (item.value == 'OLD') {
                HideUnhide(false, 'OLD', '');
                HideUnhide(false, '', 'OLD');
                $('#send').removeClass('btn-secondary').addClass('btn-success');
                $('#send').prop('disabled', false);
            }
        }
    });
    ClearFiles()
    uploadedFileNames = []
}

function CertTypeChoise(cert_type) {
    let checked;

    cert_radio = cert_type.querySelectorAll('input');
    cert_radio.forEach((item) => {
        HideUnhide(true, '', item.value);
        ReqClasses(item.value + "_req", false);
    });

    newCert_type = document.getElementById('newCert_type');

    ReqClasses('SSL_DV', false);
    cert_radio.forEach((item) => {
        // console.log( 'item в cert_radio = ', item)
        // console.log( 'item checked ? ', item.checked)
        if (item.checked) {
            HideUnhide(true, 'send', '');
            $('#send').removeClass('btn-secondary').addClass('btn-success');
            $('#send').prop('disabled', false);
            HideUnhide(false, '', item.value);
            ReqClasses(item.value + "_req", true);
            ReqClasses(item.value + "_req_secondary", false);
            // if (item.value != 'OTZ') {
            //     newCert_type.options.selectedIndex = 0;
            //     newCert_type.options[0].disabled = true;
            ReqClasses('SSL_DV', true);
            ReqClasses('EDIT_req', true);
            HideUnhide(true, '', 'SSL_DV');
            HideUnhide(false, '', 'SSL_DV_INFO');
            // }
            if (item.value == 'NEW') {
                newCert_type.options.selectedIndex = 0;
                newCert_type.options[0].disabled = true;
                ReqClasses('InfoSec', false);
                ReqClasses('MinCif', false);
                HideUnhide(true, 'send', '');
            }
            else if (item.value == 'EDIT') {
                newCert_type.options.selectedIndex = 1;
                ReqClasses('InfoSec', false);
                ReqClasses('MinCif', false);
                HideUnhide(true, '', 'SSL_DV_INFO');
                HideUnhide(false, '', 'EDIT');
                HideUnhide(true, '', 'MinCif');
                HideUnhide(false, 'send', '');
            }
            else if (item.value == 'OTZ') {
                ReqClasses('NEW', false);
                ReqClasses('EDIT', false);
                ReqClasses('OTZ', true);
                ReqClasses('SSL_DV', false);
                ReqClasses('EDIT_req', false);
                ReqClasses('InfoSec', false);
                ReqClasses('MinCif', false);
                HideUnhide(true, '', 'SSL_DV_INFO');
                HideUnhide(false, 'send', '');
            }
        }
    });
}

function newCertTypeChoise(newCert_type) {
    if (newCert_type.value == 'SSL_DV') {
        HideUnhide(true, '', 'SSL_DV');
        HideUnhide(false, '', 'SSL_DV_INFO');
        HideUnhide(true, 'send', '');
        ReqClasses('SSL_DV', false);
        // console.log('передали в CertTypeChoise =', newCert_type)
        // CertTypeChoise(newCert_type)

    }
    else if (['OV', 'DV', 'EV', 'OV_Wild', 'DV_Wild'].includes(newCert_type.value)) {
        HideUnhide(false, '', 'SSL_DV');
        HideUnhide(true, '', 'SSL_DV_INFO');
        HideUnhide(false, '', 'GlobalSign');
        HideUnhide(true, '', 'MinCif');
        HideUnhide(false, 'send', '');
        ReqClasses('SSL_DV', true);
        ReqClasses('InfoSec', true);
        ReqClasses('MinCif', false);
        // console.log('передали в CertTypeChoise =', newCert_type)
        // CertTypeChoise(newCert_type)
        cert_radio = cert_type.querySelectorAll('input');
        cert_radio.forEach((item) => {
            if (item.value === 'EDIT' && item.checked === true) {
                ReqClasses('InfoSec', false);
            }
        });
    }
    else if (['MC', 'MC_Wild'].includes(newCert_type.value)) {
        HideUnhide(false, '', 'SSL_DV');
        HideUnhide(true, '', 'SSL_DV_INFO');
        HideUnhide(true, '', 'GlobalSign');
        HideUnhide(false, '', 'MinCif');
        HideUnhide(false, 'send', '');
        ReqClasses('SSL_DV', true);
        ReqClasses('InfoSec', false);
        ReqClasses('MinCif', true);
        // console.log('передали в CertTypeChoise =', newCert_type)
        // CertTypeChoise(newCert_type)
        cert_radio = cert_type.querySelectorAll('input');
        cert_radio.forEach((item) => {
            if (item.value === 'EDIT' && item.checked === true) {
                ReqClasses('InfoSec', false);
            }
        });
    }
    else {
        HideUnhide(false, '', 'SSL_DV');
        HideUnhide(true, '', 'SSL_DV_INFO');
        HideUnhide(false, 'send', '');
        ReqClasses('SSL_DV', false);
        ReqClasses('InfoSec', false);
        ReqClasses('MinCif', false);
        // console.log('передали в CertTypeChoise =', newCert_type.value)
        // CertTypeChoise(newCert_type.value)
    }
}
function HideUnhide(true_or_false, id = '', tag_class = '') {
    if (!!tag_class) {
        area = document.querySelectorAll('.' + tag_class);
        area.forEach((item) => {
            item.hidden = true_or_false;
        });
    }
    if (!!id) {
        tag = document.getElementById(id);
        tag.hidden = true_or_false;
    }
}

function ReqClasses(tag_class, true_or_false) {
    required_area = document.querySelectorAll('.' + tag_class);
    required_area.forEach((item) => {
        item.required = true_or_false;
        if (item.id != 'newCert_type' && !true_or_false)
            item.value = '';
    });
}

function BlockUnblock(tag_class, decision) {
    block_item = document.querySelectorAll('.' + tag_class);
    block_item.forEach((item) => {
        item.disabled = decision;
    });
}

function SpecialRequestChecked(special_request, tag_class, true_or_false = true) {
    decision = special_request.checked ? true_or_false : !true_or_false;
    special_request.value = decision

    BlockUnblock('auto_request', decision);
    BlockUnblock('form_request', decision);

    // Функция, которая проверяет видимость элемента и устанавливает required в true
    function special_requestRequiredStatus(element) {
        const isVisible = element.offsetWidth > 0 || element.offsetHeight > 0;
        if (isVisible && element.classList.contains('special_request') && !element.classList.contains('not_form_request')) {
            element.required = true;
        } else {
            element.required = false;
        }
    }
    // Создаем экземпляр Intersection Observer
    var observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            special_requestRequiredStatus(entry.target);
        });
    }, { threshold: 0.5 }); // Используем порог в 0.5, чтобы реагировать на половину видимости элемента

    // Находим все элементы с классом form_request_req и not_form_request
    var formReqElements = document.querySelectorAll('.form_request_req, .not_form_request');

    // Начинаем наблюдение за каждым элементом
    formReqElements.forEach(element => {
        observer.observe(element);
    });
    // $('#send').removeClass('btn-secondary').addClass('btn-success');
    // $('#send').prop('disabled', false);
    return decision;
}

function AutoRequestChecked(auto_request, tag_class, true_or_false = true) {
    uploadedFileNames = [];
    decision = auto_request.checked ? true_or_false : !true_or_false;
    auto_request.value = decision

    BlockUnblock('special_request', decision);
    BlockUnblock('form_request', decision);
    HideUnhide(decision, '', 'file_in');
    HideUnhide(!decision, 'send', '');
    ReqClasses('file_in', !decision);

    // Функция, которая проверяет видимость элемента и устанавливает required в true
    function auto_requestRequiredStatus(element) {
        const isVisible = element.offsetWidth > 0 || element.offsetHeight > 0;
        if (isVisible && element.classList.contains('auto_request') && !element.classList.contains('not_form_request')) {
            element.required = true;
        } else {
            element.required = false;
        }
    }
    // Создаем экземпляр Intersection Observer
    var observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            auto_requestRequiredStatus(entry.target);
        });
    }, { threshold: 0.5 }); // Используем порог в 0.5, чтобы реагировать на половину видимости элемента

    // Находим все элементы с классом form_request_req и not_form_request
    var formReqElements = document.querySelectorAll('.form_request_req, .not_form_request');

    // Начинаем наблюдение за каждым элементом
    formReqElements.forEach(element => {
        observer.observe(element);
    });

    ClearFiles()
    $('#send').removeClass('btn-secondary').addClass('btn-success');
    $('#send').prop('disabled', false);
    return decision;
}

function FormRequestChecked(form_request, tag_class, true_or_false = true) {
    document.getElementById('send').disabled = true;
    decision = form_request.checked ? true_or_false : !true_or_false;

    BlockUnblock('special_request', decision);
    BlockUnblock('auto_request', decision);

    HideUnhide(decision, '', 'file_in');
    HideUnhide(!decision, '', 'form_request_req');

    // Функция, которая проверяет видимость элемента и устанавливает required в true
    function updateRequiredStatus(element) {
        const isVisible = element.offsetWidth > 0 || element.offsetHeight > 0;
        if (isVisible && element.classList.contains('form_request_req') && !element.classList.contains('not_form_request')) {
            element.required = true;
        } else {
            element.required = false;
        }
    }

    // Создаем экземпляр Intersection Observer
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            updateRequiredStatus(entry.target);
        });
    }, { threshold: 0.5 }); // Используем порог в 0.5, чтобы реагировать на половину видимости элемента

    // Находим все элементы с классом form_request_req и not_form_request
    const formReqElements = document.querySelectorAll('.form_request_req, .not_form_request');

    // Начинаем наблюдение за каждым элементом
    formReqElements.forEach(element => {
        observer.observe(element);
    });



    ClearFiles();
    return decision;
}


function CloneForm(id = '') {
    var formContainer = document.getElementById(id);
    var originalForm = formContainer.querySelector(".OLD_form");
    var clonedForm = originalForm.cloneNode(true);

    var inputs = clonedForm.querySelectorAll('input');
    inputs.forEach(function (input) {
        input.value = '';
    });

    var oldSNInput = clonedForm.querySelector("#old_s_n");
    var classValue = oldSNInput.getAttribute("class").replace(/form.*3/g, "").trim();

    // Добавить кнопку "Удалить" к копии формы
    var removeButton = document.createElement("button");
    removeButton.setAttribute("type", "button");
    removeButton.setAttribute("class", 'btn btn-danger btn-sm col-1/2 mb-3 ' + classValue);
    removeButton.setAttribute("onclick", "removeForm(this)");
    removeButton.textContent = "Удалить";
    clonedForm.appendChild(removeButton);

    formContainer.appendChild(clonedForm);
}

function removeForm(button) {
    var form = button.parentNode;
    var formContainer = form.parentNode;
    formContainer.removeChild(form);
}

function IN_template(el) {
    parent = el.parentElement
    template = parent.querySelector('#template')

    if (el.value != 'megafon.ru') {
        template.options[3].disabled = true;
        template.options.selectedIndex =
            template.value == 'PKI VMware 6.x' ?
                0 : template.options.selectedIndex;
    }
    else {
        template.options[3].disabled = false;
    }
    if (el.value === 'onefactor.com') {
        HideUnhide(true, '', 'auto_request');
        HideUnhide(false, '', 'form_request');
    }
    else {
        HideUnhide(false, '', 'auto_request');
        HideUnhide(true, '', 'form_request');
    }
}

function IF_VMware(el) {
    parent = el.parentElement
    template = parent.querySelector('#template')

    SpecialRequest = parent.querySelector('[id^="special_request"]');
    AutoRequest = parent.querySelector('[id^="auto_request"]');
    
    if (template.value == 'PKI VMware 6.x') {
        parent.querySelector('.file_in').hidden = false
        SpecialRequest.checked = true, 
        SpecialRequest.value = true, 
        // SpecialRequest.required = true,
        SpecialRequest.disabled = true,

        AutoRequest.checked = false, 
        AutoRequest.value = false, 
        // AutoRequest.required = false,
        AutoRequest.disabled = true
    }
    else {
        SpecialRequest.disabled = false,
        SpecialRequest.checked = false, 
        SpecialRequest.value = false, 
        // SpecialRequest.required = false,

        AutoRequest.disabled = false
        // AutoRequest.checked = false, 
        // AutoRequest.value = false, 
        // AutoRequest.required = false,
        
    }
}


function validatePhone(inputElement) {
    var inputValue = inputElement.value;
    var sanitizedPhone = inputValue.replace(/[\s-]/g, '');

    var regex = /^(?:\+7|8)\d{10}$/;
    var isValid = regex.test(sanitizedPhone);

    if (inputValue !== '') {
        if (isValid) {
            inputElement.style.backgroundColor = 'lightgreen';
            return true;
        } else {
            alert("Неверный формат номера телефона.\nОжидается формат:\n+71234567890 или +7-123-456-78-90\n81234567890 или 8-123-456-78-90");
            inputElement.value = ''
            inputElement.style.backgroundColor = 'pink';
            return false;
        }
    }
}
document.querySelectorAll('[id$="phone"]').forEach(function (inputElement) {
    inputElement.addEventListener('input', function () {
        inputElement.value = inputElement.value.replace(/[^0-9+\s-]/g, '');
    });
    inputElement.addEventListener('blur', function () {
        validatePhone(inputElement);
    });
});


function validateEmail(inputElement) {
    var inputValue = inputElement.value.trim();
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (inputValue !== '') {
        if (regex.test(inputValue)) {
            inputElement.style.backgroundColor = 'lightgreen';
            return true;
        } else {
            alert("Неверный формат email.\n Ожидается формат: example@domain.com");
            inputElement.value = ''
            inputElement.style.backgroundColor = 'pink';
            return false;
        }
    }
}
document.querySelectorAll('[id$="_email"]').forEach(function (inputElement) {
    inputElement.addEventListener('blur', function () {
        validateEmail(inputElement);
    });
});


function validateUrl() {
    var inputElement = document.getElementById('MinCif');
    var inputValue = document.getElementById('MinCif').value.trim();

    var regex = /^(https?):\/\/[^\s]+\/tls\/[^\/]+\.csr$/;

    if (inputValue !== '') {
        if (regex.test(inputValue)) {
            inputElement.style.backgroundColor = 'lightgreen';
            return true;
        } else {
            document.getElementById('MinCif').value = ''
            alert("Неверный формат ссылки.\nОжидается формат: http(s)://***/tls/*.csr");
            inputElement.style.backgroundColor = 'pink';
            return false;
        }
    }
}
document.getElementById('MinCif').addEventListener('blur', validateUrl);

//////////////////////////////////////////////////////////

function ClearFiles() {
    $('[id*="upload-container"]').each(function (i, uploadContainer) {
        var divElements = uploadContainer.querySelectorAll('div');
        divElements.forEach(function (element) {
            element.innerHTML = '';
        });
    });

    uploadedFileNames = []
    data_files = new DataTransfer();
}

function CheckFiles() {
    var checked = task_area.querySelector('input:checked');
    var checked_in = document.querySelector('input:checked[id*="task_internal"]')
    var uploadContainer = $('[class*="upload-container"][class*="' + checked.value + '"]');
    if (checked_in) {
        checked = checked_in
        var uploadContainer = $('[class*="upload-container"][class*="' + checked.value + '"]');
    }
    var alertWarning = uploadContainer.find('.alert-warning');
    var alertDanger = uploadContainer.find('.alert-danger');
    var alertSuccess = uploadContainer.find('.alert-success');

    var area = ''
    // console.log('area', area)
    
    all_radio.forEach((item) => {  
        if (item.checked) {
            area = item.value
        } 
    });

    if (alertDanger.length > 0 || alertWarning.length > 0) {
        //        $('#send').addClass('hidden');
        $('#send').removeClass('btn-success').addClass('btn-secondary');
        $('#send').prop('disabled', true);
        // HideUnhide(true, 'send', '');
        // document.getElementById('send').disabled = true
        // BlockUnblock('send', true);
    }
    else if (alertSuccess.length > 0) {
        $('#send').removeClass('btn-secondary').addClass('btn-success');
        $('#send').prop('disabled', false);
        // HideUnhide(false, 'send', '');
    }
    else {
        if (area === 'KON') {
            $('#send').removeClass('btn-secondary').addClass('btn-success');
            $('#send').prop('disabled', false);
        }
        else {
        //        $('#send').removeClass('hidden');
            $('#send').removeClass('btn-success').addClass('btn-secondary');
            $('#send').prop('disabled', true);
        // HideUnhide(true, 'send', '');
        // document.getElementById('send').disabled = false
        // BlockUnblock('send', false);
        }
    }
}

function CheckFormRrequest(tag = '') {
    // Получить значение из поля ввода
    if (tag = 'NEW_IN') {
        var inputCommonName = document.getElementById('cert_gen_new_common_name');
        var validCommonName = inputCommonName.value.trim().endsWith('.onefactor.com');

        var inputEmail = document.getElementById('cert_gen_new_eMail');
        var entriesEmail = inputEmail.value.split(',');
        var validEmail = entriesEmail.every((entry) => {
            const trimmedEntry = entry.trim();
            return trimmedEntry.endsWith('@onefactor.com') || trimmedEntry.endsWith('@megafon.ru');
        });

        var inputAltDNS = document.getElementById('cert_gen_new_alt_dns');
        var entriesDNS = inputAltDNS.value.split(',');
        var validDNS = entriesDNS.every((entry) => {
            var trimmedEntry = entry.trim();
            return trimmedEntry.endsWith('.onefactor.com') || trimmedEntry.endsWith('.megafon.ru');
        });

        var inputAltIP = document.getElementById('cert_gen_new_alt_ip');
        var ipAddresses = inputAltIP.value.split(',');
        var validIPs = ipAddresses.every((ip) => {
            const octets = ip.trim().split('.');
            return octets.length === 4 && octets.every((octet) => parseInt(octet, 10) >= 0 && parseInt(octet, 10) <= 255);
        });
    }
    if (tag = 'NEW_OLD') {
        var inputCommonName = document.getElementById('cert_gen_new_old_common_name');
        var validCommonName = inputCommonName.value.trim().endsWith('.onefactor.com');

        var inputEmail = document.getElementById('cert_gen_new_old_eMail');
        var entriesEmail = inputEmail.value.split(',');
        var validEmail = entriesEmail.every((entry) => {
            const trimmedEntry = entry.trim();
            return trimmedEntry.endsWith('@onefactor.com') || trimmedEntry.endsWith('@megafon.ru');
        });

        var inputAltDNS = document.getElementById('cert_gen_new_old_alt_dns');
        var entriesDNS = inputAltDNS.value.split(',');
        var validDNS = entriesDNS.every((entry) => {
            var trimmedEntry = entry.trim();
            return trimmedEntry.endsWith('.onefactor.com') || trimmedEntry.endsWith('.megafon.ru');
        });

        var inputAltIP = document.getElementById('cert_gen_new_old_alt_ip');
        var ipAddresses = inputAltIP.value.split(',');
        var validIPs = ipAddresses.every((ip) => {
            const octets = ip.trim().split('.');
            return octets.length === 4 && octets.every((octet) => parseInt(octet, 10) >= 0 && parseInt(octet, 10) <= 255);
        });
    }
    console.log('input.value =', inputCommonName.value);
    // Проверить, заканчивается ли значение на ".onefactor.com"
    if (((validCommonName) && (validEmail) && (validDNS) && (validIPs)) || ((validCommonName) && (validEmail))) {
        // Выполнить код, если условие истинно
        //   inputCommonName.required = false ;
        console.log('OK');
        document.getElementById('send').disabled = false;
    } else {
        // Выполнить код, если условие ложно
        //   inputCommonName.required = true ;
        console.log('NOT RIGHT"');
        document.getElementById('send').disabled = true;
    }
}

function isValidPem(pemContent) {
    const start = "-----BEGIN CERTIFICATE REQUEST-----";
    const end = "-----END CERTIFICATE REQUEST-----";

    const new_start = "-----BEGIN NEW CERTIFICATE REQUEST-----";
    const new_end = "-----END NEW CERTIFICATE REQUEST-----";

    pemContent = pemContent.trim()
    // cleanedPem = pemContent.replace(/\r?\n/g, ' ');
    // console.log(cleanedPem)
    // console.log(pemContent)
    // console.log(start)
    // console.log(end)
    // console.log(pemContent.startsWith(start))
    // console.log(pemContent.endsWith(end))

    // Проверяем, что строка начинается и заканчивается нужными подстроками
    if ((pemContent.startsWith(start) && pemContent.endsWith(end)) || (pemContent.startsWith(new_start) && pemContent.endsWith(new_end))) {
        return true;
    } else {
        return false;
    }
}


$(document).ready(function () {

    uploadedFileNames = [];
    all_radio = task_area.querySelectorAll('input');

    $('[id*="upload-container"]').each(function (i, uploadContainer) {

        var fileList = uploadContainer.querySelector('div')
        var fileInput = uploadContainer.querySelector('input')

        // Обработка выбранных файлов
        function handleFiles(files) {
            // Перебираем каждый выбранный файл
            $.each(files, function (i, file) {
                // Защита от повторного прикладывания файла с одинаковым именем
                if (uploadedFileNames.includes(file.name)) {
                    alert("Файл с таким именем уже существует.\nПожалуйста, приложите другой файл...");
                    return; // Exit the function if the file name already exists
                }
                else {
                    uploadedFileNames.push(file.name);
                }
                // console.log(uploadedFileNames.length)

                data_files.items.add(file)
                var fileName = file.name;
                var fileSize = (file.size / (1024)).toFixed(2) + ' KB';

                var isValid = null;
                var check_need = false;

                all_radio.forEach((item) => {
                    if (item.checked) {
                        if (item.value == 'IN') {
                            isValid = true;
                            check_need = true;
                        }

                        else if (item.value == 'KON') {
                            isValid = true;
                            check_need = false;
                        }
                    }
                });

                var fileItem = $('<div class="alert alert-warning' + ' justify-content-between align-items-center" role="alert">' +
                    fileName + ' (' + fileSize + ')' + '<button class="btn btn-danger btn-sm ml-2">Удалить</button>' + '<br></div>');

                // Обработчик клика на кнопке удаления файла
                // удаление имени из uploadedFileNames и файла из data_files
                fileItem.find('button').on('click', function () {
                    index = uploadedFileNames.indexOf(fileName);
                    if (index > -1) {
                        uploadedFileNames.splice(index, 1);
                    }
                    data_files.items.remove(file)
                    $(this).parent().remove();
                    CheckFiles();
                });

                // Уменьшение размеров строк
                fileItem.css({
                    'padding': '5px 10px',
                    'font-size': '16px',
                    'margin-bottom': '5px'
                });

                fileItem.appendTo(fileList);

                // Если файл .pem, выполняем проверку на содержание
                if (isValid && check_need) {
                    const selectedFile = file;
                    const fileContent = file;

                    if (fileContent) {
                        // Создаем объект FileReader для чтения файла
                        const fileReader = new FileReader();

                        // Ожидаем завершения чтения файла
                        fileReader.onload = async (event) => {
                            let csr
                            // Получаем содержимое файла как текст
                            const pemContent = event.target.result;
                            // console.log(pemContent)

                            try {
                                if (isValidPem(pemContent)) {
                                    console.log('file content = OK')
                                    csr = forge.pki.certificationRequestFromPem(pemContent)
                                } else {
                                    var alert_text = "Ошибка!\nСодержимое файла должно начинаться с\n'-----BEGIN CERTIFICATE REQUEST-----' \nи заканчиваться на\n'-----END CERTIFICATE REQUEST-----' !";
                                    throw new Error("Ошибка в файле! Файл начинается НЕ с конструкции -----BEGIN");
                                }
                            }
                            catch (error) {
                                console.log('Ошибка при создании объекта csr:', error);
                                if (alert_text) {
                                    alert(alert_text);
                                }
                                var element = $("div[class*='alert-']:contains('" + fileName + "')");
                                element.each(function () {
                                    var errorText = 'Файл содержит ошибки или неверный';
                                    var textNode = document.createTextNode(errorText);
                                    this.appendChild(textNode);
                                });
                            }
                            const subjectAttributes = csr.subject.attributes;

                            // console.log('subjectAttributes = \n', subjectAttributes)
                            
                            const certificate = forge.pki.certificationRequestFromPem(pemContent);
                            const certificateAttributes = certificate.subject;
                            const extensionRequest = certificate.getAttribute({ name: 'extensionRequest' });
                            const subjectAltName = [];

                            task_internal = document.getElementsByName('task_internal');
                            task_internal.forEach(
                                (el) => {
                                    if (el.checked) task_internal_value = el.value;
                                })
                            div = $('#' + task_internal_value)[0]
                            domain = div.querySelector('#domain').value
                            const csrInfo = {
                                subject: {},
                                subjectAltName: {},
                                otherData: {}
                            };
                            // console.log('csrInfo: \n', csrInfo)

                            subjectAttributes.forEach(attribute => {
                                const attributeName = attribute.name;
                                const attributeValue = attribute.value;
                                csrInfo.subject[attributeName] = attributeValue;
                                csrInfo.subjectAltName = subjectAltName;
                                // console.log('subjectAltName in subjectAttributes', subjectAltName)
                            });

                            // console.log("csrInfo.subject['commonName']:\n", csrInfo.subject['commonName']);
                            if (csrInfo.subject['commonName']) {
                                var file_domain = csrInfo.subject['commonName'].replace('@', '.').split('.').slice(-2).join('.');
                            }
                            if (extensionRequest) {
                                // console.log('extensionRequest: \n', extensionRequest)
                                // console.log('extensionRequest.extensions: \n', extensionRequest.extensions)
                                const extensions = extensionRequest.extensions;
                                // Проход по всем расширениям и вывод читаемых данных
                                for (const extension of extensions) {
                                    const encodedValue = extension.value;
                                    const encodedName = extension.name;
                                    // console.log('encodedName: \n', encodedName)
                                    // console.log('encodedValue: \n', encodedValue)
                                    if (extension.name === 'subjectAltName') {
                                        // Декодирование значения с использованием Forge
                                        const decoded = forge.asn1.fromDer(forge.util.createBuffer(encodedValue));
                                        // console.log('decoded in FOR: \n', decoded)
                                        // console.log('decoded.value in FOR: \n', decoded.value)
                                        if (Array.isArray(decoded.value)) {
                                            decoded.value.forEach(item => {
                                                subjectAltName.push(item.value);
                                            });
                                        } else {
                                            // console.log('decoded.value is not an array:', decoded.value);
                                            // Добавляем строковое значение в subjectAltName
                                            subjectAltName.push(decoded.value.toString());
                                        }
                                    } else {
                                        subjectAltName.push('');
                                    }
                                    // decoded.value.forEach(item => subjectAltName.push(item.value));
                                }
                            }

                            // console.log('subjectAltName AFTER', subjectAltName)
                            // console.log('csrInfo AFTER', csrInfo)

                            // debugger;

                            if ($('input[id^="special_request"]:visible').prop('checked') == true &&
                                csrInfo.subject['commonName']) 
                            {
                                // console.log('IF #1');
                                $("div.alert:contains('" + fileName + "')").removeClass('alert-warning').addClass('alert-success');
                                CheckFiles();
                                var elements = $("div[class*='alert-']:contains('" + fileName + "')");
                                elements.each(function () {
                                    var errorText = '';
                                    var textNode = document.createTextNode(errorText);
                                    this.appendChild(textNode);
                                });
                            } else if (csrInfo.subject['commonName'] == '' || !csrInfo.subject['commonName']) {
                                // console.log('IF #3');
                                $("div.alert:contains('" + fileName + "')").removeClass('alert-warning').addClass('alert-danger');
                                CheckFiles();
                                var elements = $("div[class*='alert-']:contains('" + fileName + "')");
                                elements.each(function () {
                                    var errorText = 'Не заполнено или отсутствует поле commonName';
                                    var textNode = document.createTextNode(errorText);
                                    this.appendChild(textNode);
                                });
                            } else if (csrInfo.subject['commonName'].includes('*.megafon.ru')) {
                                // console.log('IF #3');
                                $("div.alert:contains('" + fileName + "')").removeClass('alert-warning').addClass('alert-danger');
                                CheckFiles();
                                var elements = $("div[class*='alert-']:contains('" + fileName + "')");
                                elements.each(function () {
                                    var errorText = 'Поле запроса CN содержит недопустимое значение "*.megafon.ru"';
                                    var textNode = document.createTextNode(errorText);
                                    this.appendChild(textNode);
                                });
                            } else if (csrInfo.subject['commonName'].includes('@')) {
                                // console.log('IF #3');
                                $("div.alert:contains('" + fileName + "')").removeClass('alert-warning').addClass('alert-danger');
                                CheckFiles();
                                var elements = $("div[class*='alert-']:contains('" + fileName + "')");
                                elements.each(function () {
                                    var errorText = 'Поле запроса CN содержит недопустимые символы "@"';
                                    var textNode = document.createTextNode(errorText);
                                    this.appendChild(textNode);
                                });
                            } else if ((csrInfo.subject['emailAddress'] == '' || !csrInfo.subject['emailAddress']) &&
                                $('input[id^="special_request"]:visible').prop('checked') == false) {
                                // console.log('IF #4');
                                $("div.alert:contains('" + fileName + "')").removeClass('alert-warning').addClass('alert-danger');
                                CheckFiles();
                                var elements = $("div[class*='alert-']:contains('" + fileName + "')");
                                elements.each(function () {
                                    var errorText = 'Не заполнено или отсутствует поле emailAddress';
                                    var textNode = document.createTextNode(errorText);
                                    this.appendChild(textNode);
                                });
                            } else if (subjectAltName == '' || !subjectAltName || subjectAltName.length === 0) {
                                // console.log('IF #5');
                                // console.log('subjectAltName = ', subjectAltName);
                                $("div.alert:contains('" + fileName + "')").removeClass('alert-warning').addClass('alert-danger');
                                CheckFiles();
                                var elements = $("div[class*='alert-']:contains('" + fileName + "')");
                                elements.each(function () {
                                    var errorText = 'Не заполнено или отсутствует поле subjectAltName';
                                    var textNode = document.createTextNode(errorText);
                                    this.appendChild(textNode);
                                });
                            } else if (csrInfo.subjectAltName.length > 0 && String(csrInfo.subjectAltName).includes('@')) {
                                // console.log(' ------------- subjectAltName ------------- ')
                                // for (let i = 0; i < csrInfo.subjectAltName.length; i++) {
                                //     console.log(csrInfo.subjectAltName[i]);
                                // }
                                // console.log(' ------------- END subjectAltName ------------- ')
                                $("div.alert:contains('" + fileName + "')").removeClass('alert-warning').addClass('alert-danger');
                                CheckFiles();
                                var elements = $("div[class*='alert-']:contains('" + fileName + "')");
                                elements.each(function () {
                                    var errorText = 'Поле запроса SAN содержит недопустимые символы "@"';
                                    var textNode = document.createTextNode(errorText);
                                    this.appendChild(textNode);
                                });
                            } else if (csrInfo.subjectAltName.length > 0 && String(csrInfo.subjectAltName).includes('*.megafon.ru')) {
                                console.log(String(csrInfo.subjectAltName))
                                $("div.alert:contains('" + fileName + "')").removeClass('alert-warning').addClass('alert-danger');
                                CheckFiles();
                                var elements = $("div[class*='alert-']:contains('" + fileName + "')");
                                elements.each(function () {
                                    var errorText = 'Поле запроса SAN содержит недопустимое значение "*.megafon.ru"';
                                    var textNode = document.createTextNode(errorText);
                                    this.appendChild(textNode);
                                });
                            } else if (domain != file_domain) {
                                // console.log('IF #6');
                                $("div.alert:contains('" + fileName + "')").removeClass('alert-warning').addClass('alert-danger');
                                CheckFiles();
                                var elements = $("div[class*='alert-']:contains('" + fileName + "')");
                                elements.each(function () {
                                    var errorText = 'Выбранный домен не совпадает с доменов в файле.';
                                    var textNode = document.createTextNode(errorText);
                                    this.appendChild(textNode);
                                });
                            } else if (csrInfo.subject['commonName'] &&
                                csrInfo.subject['emailAddress'] &&
                                subjectAltName.length > 0 &&
                                domain == file_domain) {
                                // console.log('IF #2');
                                for (let i = 0; i < subjectAltName.length; i++) {
                                    if (subjectAltName[i] === csrInfo.subject['commonName']) {
                                        break; // Если число найдено, можно завершить цикл
                                    }
                                }
                                $("div.alert:contains('" + fileName + "')").removeClass('alert-warning').addClass('alert-success');
                                CheckFiles();
                            }
                        };
                        // Читаем файл как текст
                        fileReader.readAsText(selectedFile);
                    }
                }
                else {
                    $("div.alert:contains('" + fileName + "')").removeClass('alert-warning').addClass('alert-success');
                    CheckFiles();
                }
            });
            fileInput.files = data_files.files;
        }

        // Обработчики событий для drag and drop на всей области контейнера
        uploadContainer.addEventListener('dragenter', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).addClass('drag-over');
        });

        uploadContainer.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        uploadContainer.addEventListener('dragleave', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('drag-over');
        });

        uploadContainer.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('drag-over');

            var dt = e.dataTransfer;
            var files = dt.files;

            handleFiles(files);
            CheckFiles();
        });

        // Обработчик изменения выбранных файлов
        fileInput.addEventListener('change', function (event) {
            var files = event.target.files; // Получаем выбранные файлы
            try {
                handleFiles(files); // Вызываем функцию handleFiles, передавая выбранные файлы
                CheckFiles();
            } catch (error) {
                console.error('Error handling files:', error);
            }
        });

    });
    document.getElementById('send').addEventListener('click', function (event) {
        var fileInput = document.querySelector('input[type="file"]');
        // Присваиваем файлы из data_files в fileInput
        fileInput.files = data_files.files;

        // console.log('data_files = \n', data_files)
        // console.log('uploadedFileNames = \n', uploadedFileNames)
        // debugger;

        // var loadingOverlay = document.getElementById('loading-overlay');
        // HideUnhide(true, 'send', '');
        // loadingOverlay.style.display = 'flex';
        // if (fsm_answer['result']=='Error') {
        //     console.log('fsm_answer = \n', fsm_answer)
        //     loadingOverlay.style.display = 'none';
        // }
        // Выполняем действия по умолчанию для этого элемента
    });
});
