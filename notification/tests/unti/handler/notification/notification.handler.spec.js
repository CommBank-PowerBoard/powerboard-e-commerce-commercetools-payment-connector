import ctp from '../../../../src/utils/ctp.js'

const request = require('supertest');
const {setupServer} = require("../../../../src/server.js");
// eslint-disable-next-line max-len
const data = require('../../../../test-data/handler/notification/notificatrion.handler.transaction-failure.request.json');

jest.mock('../../../../src/utils/ctp.js');
jest.mock('../../../../src/config/config-loader.js');

jest.mock('../../../../src/config/config-loader.js', () => {
    const originalModule = jest.requireActual('../../../../src/config/config-loader.js');
    const loaderConfigResult = require('../../../../test-data/handler/notification/notificationConfig.json')

    return {
        __esModule: true,
        ...originalModule,
        loadConfig: jest.fn(() => loaderConfigResult),
    };
});

let ctpClient;
let updateAction;

describe('handler::notification::notification.handler', () => {
    const server = setupServer();

    beforeEach(() => {
        ctpClient = {
            builder: {
                payments: {
                    type: 'payments',
                    endpoint: '/payments',
                    features: ['create', 'update', 'delete', 'query', 'queryOne', 'queryExpand']
                }
            },
            fetchById: jest.fn(() => ({
                body: {
                    id: "12345678-9abc-def0-1234-56789abcdef0",
                    version: 3
                }
            })),
            update: jest.fn(),
            create: jest.fn(),
            fetchOrderByNymber: jest.fn(() => ({
                body: {
                    id: "23456789-abcd-ef01-2345-6789abcdef01",
                    version: 3
                }
            }))
        }
        updateAction = [
            {
                action: 'setCustomField',
                name: 'PowerboardPaymentStatus',
                value: null
            },
            {
                action: 'setCustomField',
                name: 'PaymentExtensionRequest',
                value: JSON.stringify({
                    action: 'FromNotification',
                    request: {}
                })
            }
        ];

        ctp.get.mockResolvedValue(ctpClient);

        server.listen(3001, 'localhost');
    })
    afterEach(() => {
        data.data.reference = '12345678-9abc-def0-1234-56789abcdef0';
        server.close();
        jest.clearAllMocks();
    })

    test('not POST request', () => request(server)
        .get('/')
        .expect(200)
        .then((response) => {
            expect(response.text).toEqual('')
        })
    )

    test('not found reference', () => {
        data.event = 'transaction_success';
        data.data.reference = null;

        updateAction[0].value = 'powerboard-paid';

        return request(server)
            .post('/')
            .send(data)
            .expect(200)
            .then((response) => {
                expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
            })
    })

    test('transaction success (powerboard-paid)', () => {
        data.event = 'transaction_success';
        data.data.status = 'complete';
        data.data.capture = true;

        updateAction[0].value = 'powerboard-paid';

        return request(server)
            .post('/')
            .send(data)
            .expect(200)
            .then((response) => {
                // check if function was called with correct parameter.
                expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
            })
    })

    test('transaction failure (powerboard-pending) #1', () => {
        data.event = 'transaction_failure';
        data.data.status = 'inreview';
        data.data.capture = true;

        updateAction[0].value = 'powerboard-pending';

        return request(server)
            .post('/')
            .send(data)
            .expect(200)
            .then((response) => {
                // check if function was called with correct parameter.
                expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')

                // check if function was called with correct parameters.
                expect(ctpClient.update.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                expect(ctpClient.update.mock.calls[0][2]).toBe(3)
                expect(ctpClient.update.mock.calls[0][3]).toStrictEqual(updateAction)

                // check if function was called with correct parameters.
                expect(ctpClient.fetchOrderByNymber.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                // check what function was call one time.
                expect(ctpClient.fetchOrderByNymber.mock.calls).toHaveLength(1)

                expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
            })
    })

    test('transaction failure (powerboard-pending) #2', () => {
        data.event = 'transaction_failure';
        data.data.status = 'pre_authentication_pending';
        data.data.capture = true;

        updateAction[0].value = 'powerboard-pending';

        return request(server)
            .post('/')
            .send(data)
            .expect(200)
            .then((response) => {
                // check if function was called with correct parameter.
                expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')

                // check if function was called with correct parameters.
                expect(ctpClient.update.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                expect(ctpClient.update.mock.calls[0][2]).toBe(3)
                expect(ctpClient.update.mock.calls[0][3]).toStrictEqual(updateAction)

                // check if function was called with correct parameters.
                expect(ctpClient.fetchOrderByNymber.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                // check what function was call one time.
                expect(ctpClient.fetchOrderByNymber.mock.calls).toHaveLength(1)

                expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
            })
    })

    test('transaction failure (powerboard-authorize) #1', () => {
        data.event = 'transaction_failure';
        data.data.status = 'pending';
        data.data.capture = false;

        updateAction[0].value = 'powerboard-authorize';

        return request(server)
            .post('/')
            .send(data)
            .expect(200)
            .then((response) => {
                // check if function was called with correct parameter.
                expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')

                // check if function was called with correct parameters.
                expect(ctpClient.update.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                expect(ctpClient.update.mock.calls[0][2]).toBe(3)
                expect(ctpClient.update.mock.calls[0][3]).toStrictEqual(updateAction)

                // check if function was called with correct parameters.
                expect(ctpClient.fetchOrderByNymber.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                // check what function was call one time.
                expect(ctpClient.fetchOrderByNymber.mock.calls).toHaveLength(1)

                expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
            })
    })

    test('transaction failure (powerboard-authorize) #2', () => {
        data.event = 'transaction_failure';
        data.data.status = 'pre_authentication_pending';
        data.data.capture = false;

        updateAction[0].value = 'powerboard-authorize';

        return request(server)
            .post('/')
            .send(data)
            .expect(200)
            .then((response) => {
                // check if function was called with correct parameter.
                expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')

                // check if function was called with correct parameters.
                expect(ctpClient.update.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                expect(ctpClient.update.mock.calls[0][2]).toBe(3)
                expect(ctpClient.update.mock.calls[0][3]).toStrictEqual(updateAction)

                // check if function was called with correct parameters.
                expect(ctpClient.fetchOrderByNymber.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                // check what function was call one time.
                expect(ctpClient.fetchOrderByNymber.mock.calls).toHaveLength(1)

                expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
            })
    })

    test('transaction failure (powerboard-cancelled)', () => {
        data.event = 'transaction_failure';
        data.data.status = 'cancelled';
        data.data.capture = false;

        updateAction[0].value = 'powerboard-cancelled';

        return request(server)
            .post('/')
            .send(data)
            .expect(200)
            .then((response) => {
                // check if function was called with correct parameter.
                expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')

                // check if function was called with correct parameters.
                expect(ctpClient.update.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                expect(ctpClient.update.mock.calls[0][2]).toBe(3)
                expect(ctpClient.update.mock.calls[0][3]).toStrictEqual(updateAction)

                // check if function was called with correct parameters.
                expect(ctpClient.fetchOrderByNymber.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                // check what function was call one time.
                expect(ctpClient.fetchOrderByNymber.mock.calls).toHaveLength(1)

                expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
            })
    })

    test('transaction success (powerboard-refunded)', () => {
        data.event = 'transaction_success';
        data.data.status = 'refunded';
        data.data.capture = false;

        updateAction[0].value = 'powerboard-refunded';

        return request(server)
            .post('/')
            .send(data)
            .expect(200)
            .then((response) => {
                // check if function was called with correct parameter.
                expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')

                // check if function was called with correct parameters.
                expect(ctpClient.update.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                expect(ctpClient.update.mock.calls[0][2]).toBe(3)
                expect(ctpClient.update.mock.calls[0][3]).toStrictEqual(updateAction)

                // check if function was called with correct parameters.
                expect(ctpClient.fetchOrderByNymber.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                // check what function was call one time.
                expect(ctpClient.fetchOrderByNymber.mock.calls).toHaveLength(1)

                expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
            })
    })

    test('transaction success (powerboard-requested)', () => {
        data.event = 'transaction_success';
        data.data.status = 'requested';
        data.data.capture = false;

        updateAction[0].value = 'powerboard-requested';

        return request(server)
            .post('/')
            .send(data)
            .expect(200)
            .then((response) => {
                // check if function was called with correct parameter.
                expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')

                // check if function was called with correct parameters.
                expect(ctpClient.update.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                expect(ctpClient.update.mock.calls[0][2]).toBe(3)
                expect(ctpClient.update.mock.calls[0][3]).toStrictEqual(updateAction)

                // check if function was called with correct parameters.
                expect(ctpClient.fetchOrderByNymber.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                // check what function was call one time.
                expect(ctpClient.fetchOrderByNymber.mock.calls).toHaveLength(1)

                expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
            })
    })

    test('transaction success (powerboard-failed) #1', () => {
        data.event = 'transaction_success';
        data.data.status = 'declined';
        data.data.capture = false;

        updateAction[0].value = 'powerboard-failed';

        return request(server)
            .post('/')
            .send(data)
            .expect(200)
            .then((response) => {
                // check if function was called with correct parameter.
                expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')

                // check if function was called with correct parameters.
                expect(ctpClient.update.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                expect(ctpClient.update.mock.calls[0][2]).toBe(3)
                expect(ctpClient.update.mock.calls[0][3]).toStrictEqual(updateAction)

                // check if function was called with correct parameters.
                expect(ctpClient.fetchOrderByNymber.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                // check what function was call one time.
                expect(ctpClient.fetchOrderByNymber.mock.calls).toHaveLength(1)

                expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
            })
    })

    test('transaction success (powerboard-failed) #2', () => {
        data.event = 'transaction_success';
        data.data.status = 'failed';
        data.data.capture = false;

        updateAction[0].value = 'powerboard-failed';

        return request(server)
            .post('/')
            .send(data)
            .expect(200)
            .then((response) => {
                // check if function was called with correct parameter.
                expect(ctpClient.fetchById.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')

                // check if function was called with correct parameters.
                expect(ctpClient.update.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                expect(ctpClient.update.mock.calls[0][2]).toBe(3)
                expect(ctpClient.update.mock.calls[0][3]).toStrictEqual(updateAction)

                // check if function was called with correct parameters.
                expect(ctpClient.fetchOrderByNymber.mock.calls[0][1]).toBe('12345678-9abc-def0-1234-56789abcdef0')
                // check what function was call one time.
                expect(ctpClient.fetchOrderByNymber.mock.calls).toHaveLength(1)

                expect(response.text).toEqual(JSON.stringify({notificationResponse: "[accepted]"}))
            })
    })
})