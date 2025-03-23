from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

# User Model
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(db.String(100), default='user', nullable=False)
    password = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)       
    address = db.Column(db.Text)
    pincode = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

# Pet Model
class Pet(db.Model):
    __tablename__ = 'pets'
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    pet_name = db.Column(db.String(100), nullable=False)
    breed = db.Column(db.String(100))
    age = db.Column(db.Integer)
    health_conditions = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    owner = db.relationship('User', backref=db.backref('pets', lazy=True))
