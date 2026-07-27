const validTransitions = {
    pending: ['confirmed', 'cancelled'],

    confirmed: [
        'driver_arriving',
        'cancelled'
    ],

    driver_arriving: [
        'driver_arrived',
        'cancelled'
    ],

    driver_arrived: [
        'in_progress',
        'cancelled'
    ],

    in_progress: [
        'completed'
    ]
};

module.exports = validTransitions;