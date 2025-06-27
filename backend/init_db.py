#!/usr/bin/env python3
"""
Database initialization script for RippleGate
"""

from app import create_app, db
from app.models import User, Event, Ticket

def init_database():
    """Initialize the database with all tables"""
    app = create_app()
    
    with app.app_context():
        # Drop all existing tables and recreate them
        print("Dropping existing tables...")
        db.drop_all()
        
        print("Creating new tables...")
        db.create_all()
        
        print("Database initialized successfully!")
        print("Tables created:")
        print("- users")
        print("- events") 
        print("- tickets")

if __name__ == "__main__":
    init_database() 