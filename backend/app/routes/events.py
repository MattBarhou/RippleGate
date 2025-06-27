from flask import Blueprint, request, jsonify, make_response
from app import db
from app.models import Event
from datetime import datetime

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
        event_data = request.get_json()
        
        # Convert date and time strings to datetime objects
        event_data['date'] = datetime.strptime(event_data['date'], '%Y-%m-%d')
        
        # Remove milliseconds and timezone info from the timestamp
        time_str = event_data['time'].split('.')[0]  # Remove milliseconds and anything after
        event_data['time'] = datetime.strptime(time_str, '%Y-%m-%dT%H:%M:%S')
        
        new_event = Event(**event_data)
        db.session.add(new_event)
        db.session.commit()
        return jsonify(new_event.to_json()), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# @event.route('/<int:event_id>', methods=['GET'])


