
from flask import Flask
from flask_cors import CORS  
from flask_restful import Api
from db.schema import db
from routes.users import Users, CheckUser, Login  # Ensure correct import path
from routes.pets import Pets  # Import Pets API
from routes.admin import DashboardAppointment, DashboardCounts  # Import Dashboard API
from routes.appointments import Appointments
app = Flask(__name__)

# Enable CORS for all routes, and all methods
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:mypassword@localhost:5432/petdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

api = Api(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    return response

# Register API Resources
api.add_resource(Users, '/api/users')
api.add_resource(CheckUser, '/api/users/check')  
api.add_resource(Login, '/api/users/login')
api.add_resource(Pets, '/api/pets')  # Supports GET, POST, DELETE
api.add_resource(Appointments, '/api/appointments',)
api.add_resource(DashboardCounts, '/api/dashboard/counts')
api.add_resource(DashboardAppointment, '/api/dashboard/appointments')

# Global CORS Headers (Ensures all responses include CORS & preflight OPTIONS requests)
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

# Handle OPTIONS request for preflight checks
@app.route('/api/<path:path>', methods=['OPTIONS'])
def options(path):
    return '', 204  # No Content response for preflight requests

@app.route('/')
def index():
    return "Welcome to the FluffyFix API!"

if __name__ == '__main__':
    app.run(debug=True)

