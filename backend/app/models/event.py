from .. import db
from sqlalchemy import func
from datetime import datetime

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    tickets = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(255), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    time = db.Column(db.DateTime, nullable=False)
    host_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    
    # Relationships
    host = db.relationship('User', backref='hosted_events')

    def to_json(self):
        host_name = None
        if self.host:
            # Use full email as host name
            host_name = self.host.email if self.host.email else 'Anonymous'
        
        return {
            'id': self.id,
            'title': self.title,
            'location': self.location,
            'description': self.description,
            'tickets': self.tickets,
            'price': self.price,
            'image': self.image,
            'date': self.date.strftime('%Y-%m-%d'),
            'time': self.time.strftime('%H:%M:%S'),
            'host_id': self.host_id,
            'host_name': host_name,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
