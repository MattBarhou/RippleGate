from flask import Blueprint, request, jsonify, make_response
from app import db
from app.models import Ticket, Event, User
from app.services.xrp import XRPLService
from datetime import datetime

tickets = Blueprint('tickets', __name__)
xrpl_service = XRPLService()

@tickets.route('/', methods=['OPTIONS'])
def handle_options():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response, 200

@tickets.route('/buy', methods=['POST'])
def buy_ticket():
    if request.method == 'OPTIONS':
        return handle_options()
    
    try:
        data = request.get_json()
        event_id = data.get('event_id')
        user_id = data.get('user_id')
        
        if not event_id or not user_id:
            return jsonify({'error': 'Missing event_id or user_id'}), 400
        
        # Get event and user details
        event = Event.query.get(event_id)
        user = User.query.get(user_id)
        
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if tickets are available
        if event.tickets <= 0:
            return jsonify({'error': 'No tickets available'}), 400
        
        # Create ticket record first (pending status)
        new_ticket = Ticket(
            event_id=event_id,
            user_id=user_id,
            price=event.price,
            status='pending'
        )
        
        db.session.add(new_ticket)
        db.session.commit()  # Get ticket ID
        
        # Mint NFT using XRPL service
        nft_result = xrpl_service.mint_ticket_nft(
            event_title=event.title,
            event_date=event.date.strftime('%Y-%m-%d'),
            event_location=event.location,
            ticket_id=new_ticket.id,
            user_wallet_address=user.wallet_address
        )
        
        if nft_result['success']:
            # Update ticket with NFT details
            new_ticket.nft_id = nft_result['nft_id']
            new_ticket.transaction_hash = nft_result['transaction_hash']
            new_ticket.status = 'confirmed'
            
            # Decrease available tickets
            event.tickets -= 1
            
            db.session.commit()
            
            return jsonify({
                'message': 'Ticket purchased successfully',
                'ticket': new_ticket.to_json(),
                'nft_details': nft_result
            }), 201
        else:
            # Update ticket status to failed
            new_ticket.status = 'failed'
            db.session.commit()
            
            return jsonify({
                'error': 'Failed to mint NFT ticket',
                'details': nft_result.get('error', 'Unknown error')
            }), 500
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tickets.route('/user/<int:user_id>', methods=['GET'])
def get_user_tickets(user_id):
    if request.method == 'OPTIONS':
        return handle_options()
    
    try:
        tickets = Ticket.query.filter_by(user_id=user_id).order_by(Ticket.created_at.desc()).all()
        return jsonify([ticket.to_json() for ticket in tickets]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tickets.route('/verify/<ticket_id>', methods=['GET'])
def verify_ticket(ticket_id):
    if request.method == 'OPTIONS':
        return handle_options()
    
    try:
        ticket = Ticket.query.get(ticket_id)
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404
        
        if not ticket.nft_id or not ticket.user:
            return jsonify({'verified': False, 'reason': 'NFT not minted or user not found'}), 200
        
        # Verify on-chain ownership
        is_verified = xrpl_service.verify_nft_ownership(ticket.nft_id, ticket.user.wallet_address)
        
        return jsonify({
            'verified': is_verified,
            'ticket': ticket.to_json(),
            'nft_id': ticket.nft_id
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tickets.route('/nfts/<wallet_address>', methods=['GET'])
def get_user_nfts(wallet_address):
    if request.method == 'OPTIONS':
        return handle_options()
    
    try:
        nfts_result = xrpl_service.get_user_nfts(wallet_address)
        
        if nfts_result['success']:
            return jsonify({
                'success': True,
                'nfts': nfts_result['nfts']
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': nfts_result.get('error', 'Failed to fetch NFTs')
            }), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
