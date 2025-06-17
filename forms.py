from flask_wtf import FlaskForm
from wtforms import (
    StringField,
    SubmitField,
    SelectField,
    BooleanField,
    validators,
    RadioField,
    TextAreaField,
    MultipleFileField,
)
from wtforms.validators import (
    DataRequired,
    InputRequired,
    ValidationError,
)
from wtforms.widgets import TextArea

class ItiDefForm(FlaskForm):
    task_area_choises = [
        ("IN", "Сертификаты для внутренних сервисов"),
        ("EXT", "Сертификаты для внешних сервисов"),
        ("KON", "Консультация"),
    ]
    task_internal_choises = [
        ("NEW_IN", "Выпустить сертификат"),
        ("NEW_OLD", "Выпустить и отозвать сертификат"),
        ("OLD", "Отозвать сертификат"),
    ]
    domain_choises = [
        ("", "Выбрать..."),

    ]
    template_choises = [
        ("", "Выбрать..."),
        ("Server Auth", "Server Auth"),
        ("Server Auth + Client Auth", "Server Auth + Client Auth"),
        ("PKI VMware 6.x", "PKI VMware 6.x"),
    ]
    del_reason_choises = [
        ("", "Выбрать..."),
        ("Замена сертификата", "Замена сертификата"),
        ("Компрометация ключа", "Компрометация ключа"),
        ("Вывод из эксплуатации", "Вывод из эксплуатации"),
        ("Другая причина", "Другая причина"),
    ]
    cert_type_choises = [
        ("NEW", "Новый сертификат"),
        ("EDIT", "Продление/Перевыпуск"),
        ("OTZ", "Отозвать"),
    ]
    newCert_type_choises = [
        ("", "Выбрать..."),
        ...
    ]
    domain_ext_choises = [
        ("", "Выбрать..."),
        ("other", "Другой"),
    ]

    task_area = RadioField(
        label="Выберите область задачи:", choices=task_area_choises
    )

    # Сертификаты для внутренних сервисов
    task_internal = RadioField(
        label="Действие с внутренним сертификатом:",
        choices=task_internal_choises,
    )
    domain = SelectField("Домен ", choices=domain_choises)
    template = SelectField("Шаблон ", choices=template_choises)
    delete_old = BooleanField("Отозвать старый сертификат")
    old_s_n = StringField(
        "Укажите серийный номер старого сертификата "
    )
    del_reason = SelectField(
        "Причина отзыва:", choices=del_reason_choises
    )
    comments_in = TextAreaField("Комментарий:")
    file_label = StringField(
        "Пожалуйста прикрепите файл CSR-запроса"
    )
    file_in_fileInput = MultipleFileField(
        "Выберите файлы или перетащите сюда"
    )
    file_old_fileInput = MultipleFileField(
        "Выберите файлы или перетащите сюда"
    )
    add_button = StringField("Добавить сертификат для отзыва")

    cert_type = RadioField(
        label="Действие с внешним сетрификатом:",
        choices=cert_type_choises,
    )

    special_request_new = BooleanField(
        "Запрос сгенерирован на специфическом оборудовании"
    )
    special_request_new_old = BooleanField(
        "Запрос сгенерирован на специфическом оборудовании"
    )

    auto_request_new = BooleanField(
        "Запрос на сертификат сформирован автоматическим способом (нет csr)"
    )
    auto_request_new_old = BooleanField(
        "Запрос на сертификат сформирован автоматическим способом (нет csr)"
    )

    cert_gen_new = BooleanField(
        "Сгенерировать сертификат по форме (нет csr)"
    )
    cert_gen_new_common_name = StringField("Common Name *:")
    cert_gen_new_owner_name = StringField("Имя ответственного *:")
    cert_gen_new_owner_familia = StringField(
        "Фамилия ответственного *:"
    )
    cert_gen_new_otdel = StringField("Наименование отдела *:")
    cert_gen_new_eMail = StringField(
        "eMail ответственного отдела *:"
    )
    cert_gen_new_alt_dns = StringField("Альтернативные DNS имена:")
    cert_gen_new_alt_ip = StringField("Альтернативные IP адреса:")

    cert_gen_new_old = BooleanField(
        "Сгенерировать сертификат по форме (нет csr)"
    )
    cert_gen_new_old_common_name = StringField("Common Name *:")
    cert_gen_new_old_owner_name = StringField(
        "Имя ответственного *:"
    )
    cert_gen_new_old_owner_familia = StringField(
        "Фамилия ответственного *:"
    )
    cert_gen_new_old_otdel = StringField("Наименование отдела *:")
    cert_gen_new_old_eMail = StringField(
        "eMail ответственного отдела *:"
    )
    cert_gen_new_old_alt_dns = StringField(
        "Альтернативные DNS имена:"
    )
    cert_gen_new_old_alt_ip = StringField(
        "Альтернативные IP адреса:"
    )

    # Сертификаты для внешних сервисов
    newCert_type = SelectField(
        "Тип сертификата: ", choices=newCert_type_choises
    )
    domain_name = TextAreaField("Полное имя домена:")
    domain_ext = SelectField("Домен", choices=domain_ext_choises)
    domain_owner = TextAreaField(
        "Данные сотрудника МФ, ответственного за домен:"
    )
    fio = TextAreaField("ФИО:")
    division = TextAreaField("Подразделение:")
    division_email = TextAreaField("Email подразделения:")
    phone = TextAreaField("Тел.:")
    server_owner = TextAreaField(
        "Данные ответственного за администрирование WEB-сервера:"
    )
    fio_otdel = TextAreaField("ФИО/Отдел:")
    organization = TextAreaField("Организация:")
    organization_email = TextAreaField("Email подразделения:")
    organization_phone = TextAreaField("Тел.:")
    comments_ext = TextAreaField("Описание обращения:")
    InfoSec = TextAreaField("№ InfoSec либо ссылка на InfoSec")
    MinCif = TextAreaField(
        "Ссылки на csr запросы размещенные на веб ресурсе:"
    )

    domain_full_name = TextAreaField("Полное имя домена:")
    serial_number = TextAreaField(
        "Серийный номер отзываемого сертификата:"
    )
    otziv_reason = TextAreaField(
        "Опишите причину отзыва сертификата:"
    )

    # Консультация
    comments_kon = TextAreaField("Описание обращения:")
    file_kon_fileInput = MultipleFileField(
        "Пожалуйста, прикрепите файлы при необходимости:"
    )
    send = SubmitField("Отправить")