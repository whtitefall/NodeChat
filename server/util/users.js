// [{

//     id : '',
//     name : 'Brad',
//     room : ''
// }]


class User {
    constructor(){
        this.users = []
    }

    addUser(id,name,room){
        var user = {id,name,room}
        this.users.push(user)
    }

    getUserList(room){
        var user = this.users.filter( user => user.room === room )
        var nameArray = user.map((user)=> user.name)

        return nameArray
    }

    getUser(id){

        return this.users.filter(user=>  user.id === id )[0]
    }

    removeUser(id){

        var user = this.getUser(id)
        if (user){
            this.users =  this.users.filter((user)=> user.id !== id)
        }
        
        return user 
    }
}

module.exports = {
    User
}