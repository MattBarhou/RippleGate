from flask import Blueprint, request, jsonify, make_response
from app import db
from app.models import Event, User
from datetime import datetime
from jwt import decode
import os

event = Blueprint('event', __name__)

@event.route('/', methods=['GET'])
def get_events():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200
    try:
        events = Event.query.all()
        return jsonify([event.to_json() for event in events])
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@event.route('/', methods=['POST'])
def create_event(): 
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200
    
    try:
        # Get the token from cookies to identify the current user
        token = request.cookies.get('token')
        if not token:
            return jsonify({"message": "Authentication required"}), 401
        
        # Decode the token to get user info
        try:
            data = decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
            user = User.query.filter_by(id=data["user_id"]).first()
            if not user:
                return jsonify({"message": "User not found"}), 401
        except Exception as e:
            return jsonify({"message": "Invalid token"}), 401
        
        event_data = request.get_json()
        
        # Convert date and time strings to datetime objects
        event_data['date'] = datetime.strptime(event_data['date'], '%Y-%m-%d')
        
        # Remove milliseconds and timezone info from the timestamp
        time_str = event_data['time'].split('.')[0]  # Remove milliseconds and anything after
        event_data['time'] = datetime.strptime(time_str, '%Y-%m-%dT%H:%M:%S')
        
        # Set the host_id to the current user
        event_data['host_id'] = user.id
        
        new_event = Event(**event_data)
        db.session.add(new_event)
        db.session.commit()
        return jsonify(new_event.to_json()), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500



