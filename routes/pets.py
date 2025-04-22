from flask import request, jsonify
from flask_cors import cross_origin
from flask_restful import Resource, reqparse, fields, marshal_with
from db.schema import db, Pet

# Request Parser for Pet Data
pet_args = reqparse.RequestParser()
pet_args.add_argument('owner_id', type=int, required=True, help="Owner ID is required")
pet_args.add_argument('pet_name', type=str, required=True, help="Pet Name is required")
pet_args.add_argument('breed', type=str, required=True)
pet_args.add_argument('age', type=int, required=True)
pet_args.add_argument('health_conditions', type=str, required=True)

# Define Response Fields
pet_fields = {
    'id': fields.Integer,
    'owner_id': fields.Integer,
    'pet_name': fields.String,
    'breed': fields.String,
    'age': fields.Integer,
    'health_conditions': fields.String,
}

class Pets(Resource):
    def options(self):
        return {"Allow": "DELETE"}, 200
    
    @marshal_with(pet_fields)
    def get(self):
        """Fetch all pets for the logged-in user"""
        user_id = request.args.get('user_id', type=int)  # Assuming user_id is passed as a query parameter
        if not user_id:
            return {"message": "User ID is required as a query parameter"}, 400
        pets = Pet.query.filter_by(owner_id=user_id).all()
        return pets, 200

    def post(self):
        """Add a new pet"""
        data = pet_args.parse_args()
        new_pet = Pet(
            owner_id=data['owner_id'],
            pet_name=data['pet_name'],
            breed=data.get('breed', ''),
            age=data.get('age', None),
            health_conditions=data.get('health_conditions', '')
        )
        db.session.add(new_pet)
        db.session.commit()
        return {"message": "Pet added successfully!", "pet_id": new_pet.id}, 201
    
    # @cross_origin(methods=['OPTIONS', 'DELETE'])
    @cross_origin()
    def delete(self):
        """Delete a pet by ID"""
        pet_id = request.args.get('pet_id', type=int) 
        
        pet = Pet.query.get(pet_id)
        if not pet:
            return {"message": "Pet not found"}, 404
        db.session.delete(pet)
        db.session.commit()
        return {"message": "Pet deleted successfully"}, 200