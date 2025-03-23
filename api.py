from flask import Flask, request, jsonify
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from routes.users import Users
from db.schema import db, User  # Import User model

app = Flask(__name__)

# Configure PostgreSQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:mypassword@localhost:5432/petdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Create the database tables
with app.app_context():
    db.create_all()

api = Api(app)
api.add_resource(Users, '/api/users')
# api.add_resource(Pets, '/api/pets')



@app.route('/')
def index():
    users = User.query.all()
    print(f"all users {users}")
    return "Welcome to the FluffyFix API!"

if __name__ == '__main__':
    app.run(debug=True)
