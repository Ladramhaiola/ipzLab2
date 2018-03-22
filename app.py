from flask import Flask, render_template, url_for
import os

template_dir = os.path.abspath('public/html')
app = Flask(__name__, template_folder=template_dir)

@app.route('/')
def index():
    return render_template('index.min.html')

app.run('localhost', 8080)