from flask import request, jsonify
from flask_restful import Resource, reqparse, fields, marshal_with
from db.schema import User, Pet, Appointment, db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity



# Define Response Fields
user_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'email': fields.String,
    'phone': fields.String,
    'address': fields.String,
    'pincode': fields.String,
    'role': fields.String,
}

class DashboardCounts(Resource):
 def get(self):
        usersCount = User.query.count()
        petsCount = Pet.query.count()
        appointmentsCount = Appointment.query.count()
        return {
                    "users": usersCount,
                    "pets": petsCount,
                    "appointments": appointmentsCount
         }, 200

class DashboardAppointment(Resource): 
    def get(self):
            appointments = Appointment.query.all()
            appointments_data = []
            for appointment in appointments:
                pet = Pet.query.get(appointment.pet_id)
                owner = User.query.get(appointment.owner_id)
                appointments_data.append({
                    "id": appointment.id,
                    "pet_name": pet.pet_name if pet else None,
                    "service_name": appointment.service_name,
                    "service_price": appointment.service_price,
                    "owner_name": owner.name if owner else None,
                    "appointment_date": appointment.appointment_date,
                    "appointment_time": appointment.appointment_time,
                    "status": appointment.status
                })
            return appointments_data, 200