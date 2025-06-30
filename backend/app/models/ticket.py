from .. import db
from sqlalchemy import func

class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    nft_id = db.Column(db.String(64), nullable=True)  # XRPL NFT ID
    transaction_hash = db.Column(db.String(64), nullable=True)  # XRPL transaction hash
    status = db.Column(db.String(20), nullable=False, default='pending')  # pending, confirmed, failed
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    
    # Relationships
    event = db.relationship('Event', backref='event_tickets')
    user = db.relationship('User', backref='user_tickets')

    def to_json(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'user_id': self.user_id,
            'price': self.price,
            'nft_id': self.nft_id,
            'transaction_hash': self.transaction_hash,
            'status': self.status,
            'created_at': self.created_at.isoformat() + 'Z',
            'event': self.event.to_json() if self.event else None,
            'user_wallet': self.user.wallet_address if self.user else None
        }

    def __repr__(self):
        return f"<Ticket {self.id}>"