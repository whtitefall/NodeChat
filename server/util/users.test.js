const expect = require('expect')

const {User} = require('./users')


describe('Users',()=>{

    var users ; 

    beforeEach(()=>{
        users = new User()
        users.users = [{
            id : '1',
            name: 'bot',
            room : 'bot room1'
        },
        {
            id : '2',
            name: 'bot2',
            room : 'bot room2'
        },
        {
            id : '3',
            name: 'bot3',
            room : 'bot room3'
        }]
    })

    it('should add new user', ()=>{
        var users = new User()
        var user = {
            id : 'qwe',
            name: 'botK',
            room : 'bot room2'
        }

        var reUser = users.addUser(user.id,user.name,user.room)

        expect(users.users).toEqual([user])
    })

    it('should return names for bot room2 ', ()=>{
        var userList = users.getUserList('bot room2')
        expect(userList).toEqual(['bot2'])
            
    })


    it('should return names for bot room1 ', ()=>{
        var userList = users.getUserList('bot room1')
        expect(userList).toEqual(['bot'])
            
    })

    it('should find user  ', ()=>{
        var userID = '1' 
        var user = users.getUser(userID)
        expect(user.id).toBe(userID)
            
    })

    it('should not find user  ', ()=>{
        var userID = '-1' 
        var user = users.getUser(userID)
        expect(user).toBe(undefined)
            
    })

    it('should remove a user ', ()=>{
        var userID = '1' 
        var user = users.removeUser(userID)
        expect(user.id).toBe(userID)
        expect(users.users.length).toBe(2)
    })

    it('should not remove a user ', ()=>{
        var userID = '-1' 
        var user = users.removeUser(userID)
        expect(user).toBeUndefined()
        expect(users.users.length).toBe(3)
    })
})