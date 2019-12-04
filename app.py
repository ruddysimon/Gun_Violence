import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, VARCHAR
from sqlalchemy import exc
from sqlalchemy import event
from sqlalchemy import select

app = Flask(__name__)
 
# Sets an object to utilize the default declarative base in SQLAlchemy
Base = declarative_base()

# SQLAlchemy ORM, tables cannot be mapped without a primary key

# Creates Classes which will serve as the anchor points for our tables by creating a primary key
class county_data(Base):
    __tablename__ = 'county_data'
    County = Column(VARCHAR, primary_key=True)
    State = Column(VARCHAR)
    Year = Column(Integer)
    Number_of_Incidents = Column(Integer)
    Total_Killed = Column(Integer)
    Total_Injured = Column(Integer)
    Latitude = Column(Float)
    Longitude = Column(Float)
    Population = Column(Integer)
    Median_Age = Column(Integer)
    Household_Income = Column(Integer)
    Per_Capita_Income = Column(Integer)
    Poverty_Count = Column(Integer)
    Poverty_Rate = Column(Float)
    Unemployment_Rate = Column(Float)

# -------------------------------------------------------------------------
# Database Setup
# -------------------------------------------------------------------------

engine = create_engine("sqlite:///db/2017_county_data_complete (2).sqlite", pool_pre_ping=True)
conn = engine.connect()

# Create (if not already in existence) the tables associated with our classes.
Base.metadata.create_all(engine)

# Session is a temporary binding to our DB
session = Session(bind=engine)

# Reflect Database into ORM classes
Base = automap_base()
Base.prepare(engine, reflect=True)
Base.classes.keys()

# Save reference to the table
Data = Base.classes.mp_county_data

# Create our session (link) from Python to the DB
session = Session(engine)

@app.route("/")
def index():
    
    # Return the homepage
    return render_template("index.html")

@app.route("/countydata")
def our_data():
    
    # Create a session from Python to the DB
    session = Session(engine)

    # Query the data
    results = session.query(Data.County, Data.State, Data.Number_of_Incidents, Data.Total_Killed, Data.Total_Injured, Data.Population).all()

    session.close()

    # Create a dictionary
    data_list = []
    for county, state, incidents, killed, injured, population in results:
        location_dict = {"County": county, "State": state, "Number of Incidents": incidents, "Total Number Killed": killed, "Total Number Injured": injured, "Population": population}
        data_list.append(location_dict)

    return jsonify(data_list)


if __name__ == "__main__":
    app.run()

