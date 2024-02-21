module.exports = {

    // page view
    '/': 'VIEW:index',
    '/old': 'VIEW:indexold',

    '/create': 'VIEW:create',
    '/web': 'VIEW:webwallet',
    '/desktop': 'VIEW:desktop',

    // api test
    // '/api/data/get': 'api/data/get',
    // 'POST:/api/data/save': 'api/data/save',

    ///////////////////////////

    '/api/get_balance': 'api/get_balance',
    '/api/tx_status': 'api/tx_status',
    '/api/estimate_fee': 'api/estimate_fee',
    'POST:/api/send_tx': 'api/send_tx',
    'POST:/api/create_trs': 'api/create_trs',
    
}
    