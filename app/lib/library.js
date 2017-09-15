export const toClearPhoneNumber = (num) => {
    return num.replace(/\+/g, '').replace(/\-/g, '').replace(/\(/g, '').replace(/\)/g, '');
}