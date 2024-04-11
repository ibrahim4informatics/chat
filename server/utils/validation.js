const isStrongPassword = (pw) => {
    const pwRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return pwRules.test(pw)
}
const isEmail = (em) => {
    const emRules = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emRules.test(em)
}
const isUsername = (us) => {
    const usRules = /^[a-z0-9_]{3,}$/;
    return usRules.test(us)
}

export { isEmail, isStrongPassword, isUsername }