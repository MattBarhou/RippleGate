from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from .config import Config
from flask_cors import CORS

db = SQLAlchemy()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)

    # Simple CORS setup that works
    CORS(app, 
         origins="http://localhost:5173",
         supports_credentials=True)

    from .models import User
    from .routes import auth

    app.register_blueprint(auth, url_prefix="/api/auth")

    @app.cli.command("init-db")
    def init_db_command():
        db.drop_all()
        db.create_all()
        print("Initialized the database.")

    return app

app = create_app()
