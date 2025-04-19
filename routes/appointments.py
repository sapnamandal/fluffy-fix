from flask import request
from flask_restful import Resource, reqparse, fields, marshal_with
from db.schema import db, Appointment

# Request parser
appointment_args = reqparse.RequestParser()
appointment_args.add_argument('pet_id', type=int, required=True)
appointment_args.add_argument('owner_id', type=int, required=True)
appointment_args.add_argument('appointment_date', type=str, required=True)
appointment_args.add_argument('appointment_time', type=str, required=True)
appointment_args.add_argument('service_name', type=str, required=False)
appointment_args.add_argument('service_price', type=str, required=False)
appointment_args.add_argument('status', type=str, default='Scheduled')
appointment_args.add_argument('payment_status', type=str, default='completed')

# Response format
appointment_fields = {
    'id': fields.Integer,
    'pet_id': fields.Integer,
    'appointment_date': fields.String,
    'appointment_time': fields.String,
    'service_name': fields.String,
    'service_price': fields.String, 
    'status': fields.String,
    'created_at': fields.String,
    'payment_status': fields.String,
}

class Appointments(Resource):
    @marshal_with(appointment_fields)
    def get(self):
        user_id = request.args.get('user_id', type=int) 
        
        appointments = Appointment.query.filter_by(owner_id=user_id).all()
        return appointments, 200

    def post(self):
        data = appointment_args.parse_args()
        appointment = Appointment(
            pet_id=data['pet_id'],
            owner_id=data['owner_id'],
            appointment_date=data['appointment_date'],
            appointment_time=data['appointment_time'],
            service_name=data['service_name'],
            service_price=data['service_price'],
            status=data.get('status', 'Scheduled'),
            payment_status=data.get('payment_status', 'completed')
        )
        db.session.add(appointment)
        db.session.commit()
        return {"message": "Appointment created successfully"}, 201
