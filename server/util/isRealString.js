var isRealString = (str)=>{
    console.log(str + 'aaaaaaaaaaaaaaaaaaa')
    return typeof str === 'string' && str.trim().length > 0 
}

module.exports = {
    isRealString
}