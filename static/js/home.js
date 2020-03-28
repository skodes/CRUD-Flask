
// namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/crud',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        create: function(stid, firstname, lastname, DOB, amount_due) {
            let ajax_options = {
                type: 'POST',
                url: 'api/crud',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'stid': stid,
                    'firstname': firstname,
                    'lastname': lastname,
                    'DOB': DOB,
                    'amount_due': amount_due
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(stid, firstname, lastname, DOB, amount_due) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/crud/' + lastname,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                  'stid': stid,
                  'firstname': firstname,
                  'lastname': lastname,
                  'DOB': DOB,
                  'amount_due': amount_due
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(lastname) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/crud/' + lastname,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $stid = $('#stid'),
        $firstname = $('#firstname'),
        $lastname = $('#lastname'),
        $DOB = $("#DOB"),
        $amount_due = $('#amount_due');

    // return the API
    return {
        reset: function() {
            $stid.val('');
            $lastname.val('');
            $firstname.val('');
            $DOB.val('');
            $amount_due.val('');
        },
        update_editor: function(stid, firstname, lastname, DOB, amount_due) {
            $stid.val(stid);
            $lastname.val(lastname);
            $firstname.val(firstname).focus();
            $DOB.val(DOB);
            $amount_due.val(amount_due);
        },
        build_table: function(crud) {
            let rows = ''

            // clear the table
            $('.crud table > tbody').empty();

            // did we get a crud array?
            if (crud) {
                for (let i=0, l=crud.length; i < l; i++) {
                    rows += `<tr><td class="stid">${crud[i].stid}</td><td class="firstname">${crud[i].firstname}</td><td class="lastname">${crud[i].lastname}</td><td>${crud[i].DOB}</td><td class="amount_due">${crud[i].amount_due}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),

        $stid = $('#stid'),
        $firstname = $('#firstname'),
        $lastname = $('#lastname'),
        $DOB = $('#DOB'),
        $amount_due = $('#amount_due');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(stid,firstname, lastname, DOB, amount_due) {
        return firstname !== "" && lastname !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let stid = $stid.val(),
            firstname = $firstname.val(),
            lastname = $lastname.val(),
            DOB = $DOB.val(),
            amount_due = $amount_due.val();

        e.preventDefault();

        if (validate(stid,firstname, lastname, DOB, amount_due)) {
            model.create(stid,firstname, lastname, DOB, amount_due)
        } else {
            alert('Problem with input');
        }
    });

    $('#update').click(function(e) {
        let stid = $stid.val(),
            firstname = $firstname.val(),
            lastname = $lastname.val(),
            DOB = $DOB.val(),
            amount_due = $amount_due.val();

        e.preventDefault();

        if (validate(stid,firstname, lastname, DOB, amount_due)) {
            model.update(stid,firstname, lastname, DOB, amount_due)
        } else {
            alert('Problem with input');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let lastname = $lastname.val();

        e.preventDefault();

        if (validate('placeholder', lastname)) {
            model.delete(lastname)
        } else {
            alert('Problem with  input');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            stid
            firstname,
            lastname,
            DOB,
            amount_due;

        stid = $target
            .parent()
            .find('td.stid')
            .text();

        firstname = $target
            .parent()
            .find('td.firstname')
            .text();

        lastname = $target
            .parent()
            .find('td.lastname')
            .text();

        DOB = $target
            .parent()
            .find('td.DOB')
            .text();

        amount_due = $target
            .parent()
            .find('td.amount_due')
            .text();

        view.update_editor(stid,firstname, lastname, DOB, amount_due);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
