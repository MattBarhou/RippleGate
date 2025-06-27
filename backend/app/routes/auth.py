from flask import Blueprint, request, jsonify, make_response
from app import db, bcrypt
from app.models import User
from dotenv import load_dotenv
from jwt import encode, decode
import os
load_dotenv()

auth = Blueprint('auth', __name__)

@auth.route('/me', methods=['GET'])
def me():
    token = request.cookies.get('token')
    if not token:
        return jsonify({"message": "Unauthorized"}), 401
    
    data = decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
    user = User.query.filter_by(id=data["user_id"]).first()
    return jsonify({
        "user_id": user.id,
        "email": user.email,
        "profile_picture": user.profile_picture,
        "wallet_address": user.wallet_address
    }), 200

@auth.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"message": "No data provided"}), 400
        
        email = data.get('email')
        password = data.get('password')
        profile_picture = data.get('profile_picture', '')
        wallet_address = data.get('wallet_address')
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"message": "An account with this email already exists"}), 400
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Create new user
        new_user = User(email=email, password=hashed_password, profile_picture=profile_picture, wallet_address=wallet_address)
        db.session.add(new_user)
        db.session.commit()

        # Generate JWT token
        token = encode(
            {"user_id": new_user.id, "email": email},
            os.getenv("JWT_SECRET"),
            algorithm="HS256"
        )

        # Return success response
        resp = make_response(jsonify({
            "message": "User registered successfully",
            "token": token,
            "user_id": new_user.id,
            "email": email
        }), 200)

        resp.set_cookie("token", token, httponly=True, secure=False, samesite="None")
        return resp
        
    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500


@auth.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200
    
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"message": "Invalid email or password"}), 401
    
        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"message": "Invalid email or password"}), 401
    
        token = encode(
            {"user_id": user.id, "email": email},
            os.getenv("JWT_SECRET"),
            algorithm="HS256"
        )

        resp = make_response(jsonify({
            "message": "Login successful",
            "token": token,
            "user_id": user.id,
            "email": email
        }), 200)

        resp.set_cookie("token", token, httponly=True, secure=False, samesite="None")
        return resp
        
    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500
