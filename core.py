import base64
import datetime

from business_logic.openssl import csr509
from fsm_request_module import FsmSend


def get_crt_and_decription(form):
    def check_task_area(crt, k):
        return k != "newCert_type" or (
            "task_area" in crt
            and crt["task_area"] == "Сертификаты для внешних сервисов"
        )

    crt = {}
    description = []
    old_s_n = []
    del_reason = []

    for k, v in form._fields.items():
        if "choices" in v.__dict__ and check_task_area(crt, k) and k != 'del_reason':
            for choice in v.__dict__["choices"]:
                if (
                    v.data in choice or choice[-1] in v.__dict__["raw_data"]
                ) and choice[0]:
                    crt[k] = choice[-1]
                    description.append(v.label.text.replace("Выберите о", "О"))
                    description.append(choice[-1])
        elif k == "old_s_n" and v.__dict__["raw_data"]:
            for raw in v.__dict__["raw_data"]:
                if raw:
                    old_s_n.append(
                        {
                            "label": v.label.text.replace("Укажите с", "С"),
                            "value": str(raw),
                        }
                    )
        elif k == "del_reason" and v.__dict__["raw_data"]:
            for raw in v.__dict__["raw_data"]:
                if raw:
                    del_reason.append({"label": v.label.text, "value": str(raw)})
            i = 0
            while i < min(len(old_s_n), len(del_reason)):
                description.append(old_s_n[i]["label"])
                description.append(old_s_n[i]["value"])
                description.append(del_reason[i]["label"])
                description.append(del_reason[i]["value"])
                i += 1
        elif v.data and check_task_area(crt, k):
            crt[k] = v.data
            if k != "send":
                description.append(v.label.text)
                description.append(
                    str(v.data).replace("True", "Да").replace("False", "Нет")
                )

    # Проверяем условие "cert_type" в процессе цикла
    if "cert_type" in crt and crt["cert_type"] == "Отозвать":
        crt.pop("newCert_type", None)
        description = [
            value
            for value in description
            if value not in [
                "Тип сертификата: ",
                "Lets Encrypt SSL DV",
                "GlobalSign SSL Web Server OV сертификат 1 год",
                "GlobalSign SSL Web Server DV сертификат 1 год",
                "GlobalSign SSL Web Server EV сертификат 1 год",
                "GlobalSign SSL Web Server OV Wildcard-сертификат 1 год",
                "GlobalSign SSL Web Server DV Wildcard-сертификат 1 год",
                "МинЦифры SSL Web Server OV сертификат 1 год",
                "МинЦифры SSL Web Server OV Wildcard-сертификат 1 год",
            ]
        ]

    index_of_description = -1
    for i, item in enumerate(description):
        if "Комментарий" in item or "Описание" in item:
            index_of_description = i
            break

    if index_of_description != -1:  # Если нашли "Комментарий" или "Описание"
        # Сначала добавляем все элементы до найденного
        sorted_part = description[:index_of_description]

        # Потом добавляем все элементы после следующего за найденным
        if index_of_description + 1 < len(description):
            sorted_part.extend(description[index_of_description + 2 :])

        # Наконец, добавляем найденный элемент и тот, который был за ним, в конец списка
        sorted_part.append(description[index_of_description])
        if index_of_description + 1 < len(description):
            sorted_part.append(description[index_of_description + 1])

        description = sorted_part

    return crt, description



def get_files(files):
    files_list = []
    if files:
        for file in files:
            if file and files:
                files_list.append(
                    [
                        file.filename,
                        base64.b64encode(file.stream.read()).decode(),
                    ]
                )
    return files_list


def iti_defence_check(files_list, crt):
    error = {}
    error_answer = []
    errors_file_list = []
    out_df = {}
    if not files_list:
        return "Нет файла"
    else:
        for filename, file_content in files_list:
            out_df[filename], error[filename] = csr509(
                file_content, filename, crt["domain"]
            )
        for filename, errors in error.items():
            if errors:
                errors_file_list.append(filename)
                error_answer.append(f"Ошибка в файле {filename}.")
                error_answer.append(
                    f" {','.join(errors)} некорректн"
                    f"{'ы' if len(errors) > 1 else 'а'}. "
                )
        if error_answer:
            return error_answer, errors_file_list
    return False, []


def if_send(domain_user, crt, description, files_list, referrer):
    send_obj = FsmSend(prod_trigger=True)
    if "send" in crt:
        del crt["send"]
    fields_array = {}
    fields_array["cmbTask"] = crt["task_area"]
    if "cert_type" in crt:
        fields_array["cmbCert"] = crt["cert_type"].replace("Отозвать", "Отзыв")
    if "domain_ext" in crt:
        fields_array["cmbADName"] = crt["domain_ext"]


    sysdesc = [
        f'Технологические запросы (ИТ,ТД) :: Сертификаты для WEB-серверов :: {fields_array["cmbTask"]}',
        crt["cert_type"] if "cert_type" in crt else "",
        f"Заявка сформирована с {referrer}" if referrer != "" else "",
        f"Дата: {str(datetime.datetime.now())}",
    ]

    send_obj.create_sd(
        secret_params_1,
        secret_params_2,
        ...
    )

    return send_obj.make_fsm_request()
