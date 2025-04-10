from flask import request, jsonify
from flask_restful import Resource, reqparse, fields, marshal_with
from db.schema import User, db
from werkzeug.security import generate_password_hash, check_password_hash

# ✅ Request Parsers
user_args = reqparse.RequestParser()
user_args.add_argument('name', type=str, required=True, help="Name is required")
user_args.add_argument('email', type=str, required=True, help="Email is required")
user_args.add_argument('password', type=str, required=True, help="Password is required")
user_args.add_argument('phone', type=str, required=True, help="Phone number is required")
user_args.add_argument('address', type=str, required=False)
user_args.add_argument('pincode', type=str, required=False)
user_args.add_argument('role', type=str, required=False)

email_args = reqparse.RequestParser()
email_args.add_argument('email', type=str, required=True, help="Email is required")

login_args = reqparse.RequestParser()
login_args.add_argument('email', type=str, required=True, help="Email is required")
login_args.add_argument('password', type=str, required=True, help="Password is required")

# ✅ Define Response Fields
user_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'email': fields.String,
    'phone': fields.String,
    'address': fields.String,
    'pincode': fields.String,
    'role': fields.String,
}

login_fields = {
    "user": fields.Nested(user_fields),
    'message': fields.String
}

class Users(Resource):
    @marshal_with(user_fields)
    def get(self):
        return User.query.all(), 200  # ✅ Ensuring correct response code

    def post(self):
        data = user_args.parse_args()
        if User.query.filter_by(email=data['email']).first():
            return {"message": "User already exists"}, 400

        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

        new_user = User(
            name=data['name'],
            email=data['email'],
            password=hashed_password,
            phone=data['phone'],
            address=data.get('address', "N/A"),
            pincode=data.get('pincode', "000000"),
            role=data.get('role', "user")
        )
        db.session.add(new_user)
        db.session.commit()
        return {"message": "User created successfully"}, 201

class CheckUser(Resource):
    def post(self):
        data = email_args.parse_args()
        user = User.query.filter_by(email=data['email']).first()
        return {
            "message": "User already exists" if user else "User doesn't exist",
            "isNewUser": not bool(user)
        }, 200  

class Login(Resource):
    def post(self):
        data = login_args.parse_args()
        user = User.query.filter_by(email=data['email']).first()

        if not user:
            return {"message": "User not found"}, 404  # ✅ Correct response code

        if check_password_hash(user.password, data['password']):
            return {
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "phone": user.phone
                }
            }, 200
        return {"message": "Invalid password"}, 401  # ✅ Correct response code
