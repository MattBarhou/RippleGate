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

    # Set up cors to allow requests from the react frontend
    CORS(app, 
         origins=["http://localhost:5173", "https://ripplegate-1.onrender.com"],
         supports_credentials=True)

    # Register blueprints
    from .models import User
    from .models import Event
    from .models import Ticket
    from .routes import auth
    from .routes import event
    from .routes import tickets
    app.register_blueprint(auth, url_prefix="/api/auth")
    app.register_blueprint(event, url_prefix="/api/event")
    app.register_blueprint(tickets, url_prefix="/api/tickets")

    @app.cli.command("init-db")
    def init_db_command():
        db.drop_all()
        db.create_all()
        print("Initialized the database.")

    return app

app = create_app()
