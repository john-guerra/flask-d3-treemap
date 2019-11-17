from flask import Flask, escape, request, make_response, render_template
import io
import csv
import sqlite3

app = Flask(__name__)


@app.route('/')
def home():
    return render_template("index.html", name="John")


@app.route('/data')
def hello():
    hierarchyList =request.args.get("hierarchy", "Dpto,Table Name").split(",")
    hierarchy = ",".join(['"%s"'%x for x in hierarchyList])
    print(hierarchy)

    conn = sqlite3.connect('main.db')
    cursor = conn.cursor()


    query = "select %s, count(*) from fuerza group by %s;"%(hierarchy,hierarchy)
    print(query)

    csvList = list(cursor.execute(query))

    si = io.StringIO()
    cw = csv.writer(si)
    cw.writerows([tuple(hierarchyList + ["count"])] + csvList)
    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = "attachment; filename=export.csv"
    output.headers["Content-type"] = "text/csv"
    return output

