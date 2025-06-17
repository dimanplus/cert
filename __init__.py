from .models import iti_defence_db
from .router import iti_defence_route


def create_iti_defence_app(app):
    # подключение бд #
    iti_defence_db.init_app(app)

    # регистрация маршрутов #
    app.register_blueprint(iti_defence_route)
