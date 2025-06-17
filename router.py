import datetime
import os
import inspect

from flask import Blueprint, request, render_template

from flask import (
    Blueprint,
    request,
    render_template,
    jsonify,
    session,
)

from loguru import logger

from decorators import apology_decorator
from config import fsm_rep_link, ldap
from data_base_module import DB_conn, SqlPg
from fsm_request_module import FsmSend
from fsm_request_module import FsmInteraction
from access_module import domain_user_check, win_pltfrm

from .forms import ItiDefForm
from .core import (
    get_files,
    get_crt_and_decription,
    if_send,
)

iti_defence_route = Blueprint(
    "iti_defence",
    __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/***/static",
)

saved_referer = None


@iti_defence_route.route("/", methods=["GET", "POST"])
@apology_decorator
def iti_defence():
    task_area_choise = "Сертификаты для внутренних сервисов"
    task_internal_choise = "Выпустить сертификат"
    global saved_referer

    def check_can_send():
        if crt:
            logger.info(crt)
            if "task_area" in crt:
                if crt["task_area"] != task_area_choise:
                    return True
                elif crt["task_internal"] != task_internal_choise:
                    return True
            if files_list:
                return True
            elif "auto_request_new" or "auto_request_new_old" in crt:
                return True
            elif "cert_gen_new" in crt:
                return True
        return False

    def check_domain():
        if files_list and crt:
            if "domain" in crt:
                return True
        return False

    def check_file_existing():
        if "task_area" in crt:
            if crt["task_area"] == task_area_choise:
                if crt["task_internal"] == task_internal_choise:
                    if "auto_request_new" in crt:
                        if crt["auto_request_new"] == "True":
                            return True
                    if "cert_gen_new" in crt:
                        if crt["cert_gen_new"] == "True":
                            return True
        return False

    form = ItiDefForm(request.form)
    domain_user = request.headers.get("X-Remote-User")

    referrer = request.headers.get("Referer")

    if not saved_referer and referrer:
        saved_referer = referrer

    answer = ""

    if not win_pltfrm():
        domain_user = domain_user_check(domain_user, "NA")
    files_tags = [file_tag for file_tag in request.files.keys()]
    files_list = []
    i = 0
    while not files_list and i < len(files_tags):
        files = request.files.getlist(files_tags[i])
        files_list = get_files(files)
        i += 1
    errors_file_list = []
    crt, description = get_crt_and_decription(form)

    if check_can_send():
        answer = if_send(description, files_list)
        if "Error" not in answer["result"]:
            form = ItiDefForm()
    elif check_file_existing():
        answer = {
            "result": "formError",
            "formError": [
                "Для отправки сертификатов для внутренних сервисов",
                "выберите файл(ы)",
            ],
        }

    number_L = "TOP SECRET"
    SQL_string = f"""
        select ***, *** from "TOP SECRET"
        where *** in (
            select *** from "TOP SECRET"
            where *** = '{number_L}'
        )
        AND "***" LIKE '%***%' 
    """

    file_path = os.path.dirname(inspect.getfile(inspect.currentframe()))

    with DB_conn(fsm_rep_link) as db:
        result_SQL = db.exec(SQL_string)

        number = result_SQL[0][1]

        fsm_inter = FsmInteraction(
            task_number=number,
            prod_trigger=True,
        )
        fsm_inter.retrieve_ocm_info_request()
        
        print(fsm_inter.send_obj.uploaded_files)
        fsm_inter.create_add_param_request(
            secret_param_1,
            secret_param_2,
            ...
        )

    return render_template(
        "iti_defence.html",
        fsm_answer=answer,
        files_list=files_list,
        errors_file_list=errors_file_list,
    )

@iti_defence_route.route("/upload", methods=["POST"])
def process_text():
    data = request.get_json()  # Получаем данные из тела запроса
    subject = data.get("subject")  # Извлекаем значение переменной subject
    out_def = {}
    error = []
    warnings = []
    domain = data.get("domain")
    for key, value in subject.items():
        if key in ["commonName"] and value:
            d = value.replace("@", ".").split(".")
            d = str(d[-2] + "." + d[-1])
            item = value.split(".")[0]
            if d == domain:
                if "*" in value:
                    ret_value = ldap.comp_search(item, domain)
                else:
                    """Проверка имени хоста в поле CN на наличее записи в AD"""
                    ret_value = ldap.search_socket(item)
            else:
                error.append(key)
                ret_value = False
        elif (
            key
            in [
                "organizationName",
                "organizationalUnitName",
                "givenName",
                "surname",
            ]
            and value
        ):
            ret_value = True
        elif key in ["countryName"] and len(value) == 2:
            ret_value = True
        elif key in ["emailAddress"] and value:
            ret_value = ldap.in_mail(value)
            if ret_value == False:
                error.append(key)
            if ret_value == None:
                warnings.append(key)
        elif key in ["localityName"]:
            ret_value = True
        else:
            ret_value = False
            error.append(key)
        out_def[key] = ret_value
    if len(error) == 0:
        # Далее вы можете обработать subject и выполнить необходимые действия
        response = jsonify({"message": "Файл корректный"})
        return response
    else:
        answer = f"Некорректные поля : {error}"
        response = jsonify({"message": "Некорректные поля", "errors": error})
        return response
