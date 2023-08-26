module.exports = {
    PORT: 5001,

    WEB_STATUS_CODE: {
        OK: 200,
        CREATED: 201,
        NO_CONTENT: 204,
        SEE_OTHER: 303,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
        SERVER_ERROR: 500,
        FORBIDDEN: 403
    },

    USER_TYPE: {
        ADMIN: 1,
        USER: 2
    },

    LIMIT: 12,
    PAGE: 1,

    ORDER_STATUS: {
        CREATED: 1,
        CANCELLED: 2,
        READY: 3,
        SHIPPED: 4,
        COMPLETED: 5
    }
}