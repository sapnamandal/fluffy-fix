from flask import request, jsonify
from flask_restful import Resource, reqparse, abort, fields, marshal_with

from db.schema import User, db

user_args = reqparse.RequestParser()
user_args.add_argument('name', type=str, help='Name of the user', required=True)
user_args.add_argument('email', type=str, help='Email of the user', required=True)
user_args.add_argument('password', type=str, help='Password of the user', required=True)
user_args.add_argument('phone', type=str, help='Phone number of the user', required=True)
user_args.add_argument('address', type=str, help='Address of the user', required=False)
user_args.add_argument('pincode', type=str, help='Pincode of the user', required=False)
user_args.add_argument('role', type=str, help='Role of the user', required=False)

email_args = reqparse.RequestParser()   
email_args.add_argument('email', type=str, help='Email of the user', required=True)

login_args = reqparse.RequestParser()
login_args.add_argument('email', type=str, help='Email of the user', required=True)
login_args.add_argument('password', type=str, help='Password of the user', required=True)

user_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'email': fields.String,
    'phone': fields.String,
    'address': fields.String,
    'pincode': fields.Integer,
    'role': fields.String,
}

login_fields = {
    "user": fields.Nested(user_fields),
    'message': fields.String
}

class Users(Resource):
    def patch(self):
        data = email_args.parse_args()
        users = User.query.filter_by(email=data['email']).count()
        if users > 0:
            return {"message": "User already exists", "isNewUser": False}, 200
        return {"message": "User doesn't exits", "isNewUser": True}, 200
     
    @marshal_with(user_fields)
    def get(self):
        users = User.query.all()
        user_list = [{"id": u.id, "role": u.role, "name": u.name, "email": u.email, "phone": u.phone, "address": u.address, "pincode": u.pincode} for u in users]
        return user_list
    
    @marshal_with(login_fields) 
    def put(self):
        data = login_args.parse_args()
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            return {"message": "User not found"}, 404
        if user.password == data['password']:
            return  {"message": "login success", "user":user}, 200
        return {"message": "Invalid password"}, 401

    def post(self):
        data = user_args.parse_args()
        new_user = User(
            name=data['name'],
            email=data['email'],
            password=data['password'],  
            phone=data['phone'],
            address=data['address'],
            pincode=data['pincode'],
            role=data['role']
        )
        db.session.add(new_user)
        db.session.commit()
        return {"message": "User created successfully"}, 201

# ✅ Login Route (Auto-Create User if Not Found)
# @app.route('/api/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data['email']
#     password = data['password']

#     user = User.query.filter_by(email=email).first()

#     if user:
#         # If user exists, check password
#         if user.password == password:
#             return jsonify({
#                 "message": "Login successful",
#                 "user": {
#                     "id": user.id,
#                     "name": user.name,
#                     "email": user.email,
#                     "phone": user.phone
#                 }
#             }), 200
#         else:
#             return jsonify({"message": "Invalid password"}), 401
#     else:
#         # If user doesn't exist, create a new one
#         new_user = User(
#             name="New User",
#             email=email,
#             phone="Not provided",
#             password=password  # In real apps, hash the password!
#         )
#         db.session.add(new_user)
#         db.session.commit()

#         return jsonify({
#             "message": "Account created successfully!",
#             "user": {
#                 "id": new_user.id,
#                 "name": new_user.name,
#                 "email": new_user.email,
#                 "phone": new_user.phone
#             }
#         }), 201
        


# # Route to add a new user
# @app.route('/users', methods=['POST'])
# def add_user():
#     data = request.get_json()
#     if not data or not data.get('name') or not data.get('email') or not data.get('password'):
#         return jsonify({"error": "Missing required fields"}), 400
    
#     new_user = User(
#         name=data['name'],
#         email=data['email'],
#         password=data['password'],  # Hash passwords in real apps
#         phone=data.get('phone'),
#         address=data.get('address')
#     )
#     db.session.add(new_user)
#     db.session.commit()
#     return jsonify({"message": "User created successfully"}), 201

# # Route to get all users
# @app.route('/users', methods=['GET'])
# def get_users():
#     users = User.query.all()
#     user_list = [{"id": u.id, "name": u.name, "email": u.email, "phone": u.phone, "address": u.address} for u in users]
#     return jsonify(user_list)

# # Route to get a single user by ID
# @app.route('/users/<int:user_id>', methods=['GET'])
# def get_user(user_id):
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"message": "User not found"}), 404
#     return jsonify({"id": user.id, "name": user.name, "email": user.email, "phone": user.phone, "address": user.address})

# # Route to update a user
# @app.route('/users/<int:user_id>', methods=['PUT'])
# def update_user(user_id):
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"message": "User not found"}), 404
    
#     data = request.get_json()
#     user.name = data.get('name', user.name)
#     user.email = data.get('email', user.email)
#     user.password = data.get('password', user.password)  # Hash passwords in real apps
#     user.phone = data.get('phone', user.phone)
#     user.address = data.get('address', user.address)
    
#     db.session.commit()
#     return jsonify({"message": "User updated successfully"})

# # Route to delete a user
# @app.route('/users/<int:user_id>', methods=['DELETE'])
# def delete_user(user_id):
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"message": "User not found"}), 404
    
#     db.session.delete(user)
#     db.session.commit()
#     return jsonify({"message": "User deleted successfully"})

