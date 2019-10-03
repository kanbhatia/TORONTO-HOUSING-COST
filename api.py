# Importing required modules
import pandas as pd
from sqlalchemy import inspect, create_engine

from flask import Flask, jsonify

# Location of Csv files
appstat_loc = "Data/Final Data/final_table_all_values.csv" 
rentavg_loc = "Data/Final Data/final_table_clean.csv"
allrent_loc = "Data/Final Data/rent_application_per_condo_size.csv"

# Reading csv files using pandas
appstat = pd.read_csv(appstat_loc)
rentavg = pd.read_csv(rentavg_loc)
allrent = pd.read_csv(allrent_loc)

# Connect to local data base
rds_connection_string = "postgres:postgres@localhost:5432/Housing_cost"
engine = create_engine(f'postgresql://{rds_connection_string}')

appstat.to_sql(name='App_Stat', con=engine, if_exists='append', index=False)
rentavg.to_sql(name='Rent_Avg', con=engine, if_exists='append', index=False)
allrent.to_sql(name='All_Rent', con=engine, if_exists='append', index=False)

# Reading data from PostGres
appstat = pd.read_sql_query('select * from "App_Stat"', con=engine).to_dict()
rentavg = pd.read_sql_query('select * from "Rent_Avg"', con=engine).to_dict()
allrent = pd.read_sql_query('select * from "All_Rent"', con=engine).to_dict()

# App created
app = Flask(__name__)

@app.route("/")
def home():
    return "<a href=http://127.0.0.1:5000/appstat>App Staticstics</a><br>\
    <a href=http://127.0.0.1:5000/rentavg>Rent Average</a><br>\
    <a href=http://127.0.0.1:5000/allrent>All Rent</a><br>"

@app.route("/appstat")
def jsonified_appstat():
    return jsonify(appstat)

@app.route("/rentavg")
def jsonified_rentavg():
    return jsonify(rentavg)
    
@app.route("/allrent")
def jsonified_allrent():
    return jsonify(allrent)

if __name__ == "__main__":
    app.run(debug=True)