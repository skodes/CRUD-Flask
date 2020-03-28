
# imports
from datetime import datetime

from flask import make_response, abort


def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d"))


#prepopulate API
crud = {
    "Apple": {
        "stid": '100',
        "firstname": "Red",
        "lastname": "Apple",
        "DOB": "24/01/1996",
        "amount_due":"1500",
    },
    "Orange": {
        "stid": '101',
        "firstname": "Orange",
        "lastname": "Orange",
        "DOB": "28/12/1998",
        "amount_due":"3000",
    },
}


def read_all():
    return [crud[key] for key in sorted(crud.keys())]


def read_one(lastname):
    if lastname in crud:
        person = crud.get(lastname)
    else:
        abort(
            404, "Person with last name {lastname} not found".format(lastname=lastname)
        )

    return person


def create(person):

    stid = person.get("stid", None)
    lastname = person.get("lastname", None)
    firstname = person.get("firstname", None)
    DOB = person.get("DOB", None)
    amount_due = person.get("amount_due", None)

    if lastname not in crud and lastname is not None:
        crud[lastname] = {
            "stid":stid,
            "lastname": lastname,
            "firstname": firstname,
            "DOB": DOB,
            "amount_due" : amount_due,
        }
        return crud[lastname], 201

    else:
        abort(
            406,
            "Peron with last name {lastname} already exists".format(lastname=lastname),
        )


def update(lastname, person):

    if lastname in crud:
        crud[lastname]["stid"] = person.get("stid")
        crud[lastname]["firstname"] = person.get("firstname")
        crud[lastname]["DOB"] = person.get("DOB")
        crud[lastname]["amount_due"] = person.get("amount_due")

        return crud[lastname]

    else:
        abort(
            404, "Person with last name {lastname} not found".format(lastname=lastname)
        )


def delete(lastname):

    if lastname in crud:
        del crud[lastname]
        return make_response(
            "{lastname} successfully deleted".format(lastname=lastname), 200
        )

    else:
        abort(
            404, "Person with last name {lastname} not found".format(lastname=lastname)
        )
