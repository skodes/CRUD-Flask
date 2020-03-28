from flask import render_template
import connexion

from gevent.pywsgi import WSGIServer

# set the application instance
app = connexion.App(__name__, specification_dir="./")
app.add_api("swagger.yml")

@app.route("/")
def home():
    return render_template("home.html")


if __name__ == "__main__":
    app.run(debug=True)
    http_server = WSGIServer(('127.0.0.1', 5000), app)
    http_server.serve_forever()
