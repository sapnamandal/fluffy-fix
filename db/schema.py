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
   # appointments = db.relationship('Appointment', backref='user', lazy=True)
   created_at = db.Column(db.DateTime, default=db.func.current_timestamp())


# Pet Model
class Pet(db.Model):
   __tablename__ = "pets"


   id = db.Column(db.Integer, primary_key=True)
   owner_id = db.Column(db.Integer, nullable=False)
   pet_name = db.Column(db.String(100), nullable=True)
   breed = db.Column(db.String(100), nullable=True)
   age = db.Column(db.Integer, nullable=True)
   health_conditions = db.Column(db.String(255), nullable=True)
   created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
  
  
# Appointment Model
class Appointment(db.Model):
   __tablename__ = 'appointments'
   id = db.Column(db.Integer, primary_key=True)
   pet_id = db.Column(db.Integer, db.ForeignKey('pets.id', ondelete='CASCADE'), nullable=False)
   owner_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
   appointment_date = db.Column(db.String, nullable=False)
   appointment_time = db.Column(db.String, nullable=False)
   service_name = db.Column(db.String(50))
   service_price = db.Column(db.Integer)
   status = db.Column(db.String(20), default='Scheduled')
   payment_status = db.Column(db.String(20), default='completed')
   created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
  


   # pet = db.relationship('Pet', backref=db.backref('appointments', lazy=True))
   # owner_id = db.relationship('User', backref=db.backref('appointments', lazy=True))
