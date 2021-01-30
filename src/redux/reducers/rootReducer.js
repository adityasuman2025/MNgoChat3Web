const initState = {
    loginInfo: {},
    registerInfo: {},
}

const rootReducer = (state = initState, action) => {
    const { type, payload } = action
    switch (type) {
        case 'LOGIN_USER': return { ...state, loginInfo: payload }
        case 'REGISTER_USER': return { ...state, registerInfo: payload }

        default: return state
    }
}

export default rootReducer;