# Roomers Rest API Documentation 

## User API

### Signup
- description: create new authorized user
- request: `POST /api/signup/`
    - content-type: `application/json`
    - body: object
        - email: (string) users email. Must be in email format
        - password: (string) users password. Must be at least 8 characters long
        - firstname: (srting) users first name. Must be alphanumeric format
        - lastname: (string) users last name. Must be alphanumeric format
        - birthday: (Date) users Date
        - location: (string) users location. Must be alphanumeric format
- response: 200
    - body: New User signed up
- response: 400
    - body: Bad input
- response: 500
    - body: User with email already exists 
```
$ curl  -X POST 
        -H "Content-Type: application/json" 
        -d '{"email":"alice",
             "password":"alice",
             "firstname":"Alice",
             "lastname":"A",
             "birtday":"2000/01/01"
            }' 
        -c cookie.txt 
        https://localhost:3000/api/signup/
```
### Signin
- description: authorize existing user
- request: `POST /api/signin/`
    - content-type: `application/json`
    - body: object
        - email: (string) users email. Must be in email format
        - password: (string) users password. Must be at least 8 characters long
- response: 200
    - body: User signed in
- response: 400
    - body: Bad input
- response: 401
    - body: access denied
- response: 500
    - body: Error Occurred
```
$ curl  -X POST 
        -H "Content-Type: application/json" 
        -d '{"email":"alice",
             "password":"alice"
           }'
        -c cookie.txt 
        https://localhost:3000/api/signin/
```
### Sign out
- description: un-authorize user:
- request: `GET /signout/`
- response: 200 everything is ok. Redirects to `/`
 ``` 
 $ curl -X GET
        -c cookie.txt 
         https://localhost:3000/api/signout/
 ``` 
#
## Rooms API

### Create Room
- description: create a new Room
- request: `POST /api/rooms/new/`
    - content-type: `application/json`
    - body: object
        - title: (string) the title of the room
        - address: (string) the address of the room
        - images: (files) images of the room
        - price: (number) price of the room. Minimum 0
        - city: (string) city the room is located in
        - hours: object 
            - start: (number) start minute of room. Must be within 0-1439
            - end: (number) end minute of room. Must be within 0-1439
        - days: (list of strings) days of the week room is available for. Must be one of: `Monday` `Tuuesday` `Wednessday` `Thursday` `Friday` `Saturday` `Sunday`
        - purposes: (list of stings) purposes of the room. Must be one of: `social` `personal` `business`
        - capacity: (number) capacity of the room
        - Owner: (user) owner of the room
        - description: (sting) description of the room
        - rating: (number) rating of the room (optional)
        - numberOfVisits: (number) number of visits of the room (optional)
        
- response: 200
    - body: Added room successfully
- response: 401
     - body: invalid input
- response: 401
     - body: access denied

``` 
$ curl -X POST 
       -H "Content-Type: `application/json`" 
       -d '{
            "title": "UTSC ROOM",
            "address": "1265 Military Trail, Scarborough, ON M1C 1A4",
            "price": "500",
            "city": "Toronto",
            "hours": {
                "start": "100",
                "end": "200"
            },
            "days": [
                "monday",
                "friday"
            ],
            "purposes": [
                "social",
                "business"
            ],
            "capacity": "400",
            "owner": "Me",
            "description": "bleh"
        }'
       -F ‘data=@path/to/local/file’
       -c cookie.txt 
       https://localhost:3000/api/upload/'
```
### View Room
- description: Retrieve Room from its id
- request: `GET /api/room=:id`
- response: 200
    - content-type: `application/json`
    - body: Room object
        - title: (string) the title of the room
        - address: (string) the address of the room
        - images: (files) images of the room
        - price: (number) price of the room. Minimum 0
        - city: (string) city the room is located in
        - hours: object 
            - start: (number) start minute of room. Must be within 0-1439
            - end: (number) end minute of room. Must be within 0-1439
        - days: (list of strings) days of the week room is available for. Must be one of: `Monday` `Tuuesday` `Wednessday` `Thursday` `Friday` `Saturday` `Sunday`
        - purposes: (list of stings) purposes of the room. Must be one of: `social` `personal` `business`
        - capacity: (number) capacity of the room
        - Owner: (user) owner of the room
        - description: (sting) description of the room
        - rating: (number) rating of the room (optional)
        - numberOfVisits: (number) number of visits of the room (optional)
- response: 401
    - body: Room does not exist
- response: 500
    - body: error occurred
```
$ curl -X GET
       https://localhost:3000/api/room=jdafjkhdfhjkahdfjaefdajs
```
### Search Room
- description: Search Room from location and date available
- request: `GET /api/search?location='SomeLocation'&date='SomeDate'`
- response: 200
    - content-type: `application/json`
    - body: list of Room object
        - title: (string) the title of the room
        - address: (string) the address of the room
        - images: (files) images of the room
        - price: (number) price of the room. Minimum 0
        - city: (string) city the room is located in
        - hours: object 
            - start: (number) start minute of room. Must be within 0-1439
            - end: (number) end minute of room. Must be within 0-1439
        - days: (list of strings) days of the week room is available for. Must be one of: `Monday` `Tuuesday` `Wednessday` `Thursday` `Friday` `Saturday` `Sunday`
        - purposes: (list of stings) purposes of the room. Must be one of: `social` `personal` `business`
        - capacity: (number) capacity of the room
        - Owner: (user) owner of the room
        - description: (sting) description of the room
        - rating: (number) rating of the room (optional)
        - numberOfVisits: (number) number of visits of the room (optional)
- response: 400
    - body: Invalid location or date
```
$ curl -X GET
       https://localhost:3000//api/search?location=Toronto&date=2019/01/01
```
### Room Booking
- description: Booking the room 
- request: `POST /api/rooms/book/`
    - content-type: `application/json`
    - body: object
        - roomId: (string) id of the room
        - day: (Date) day thr room to be book on
        - purposes: (list of stings) purposes of the room. Must be one of: `social` `personal` `business`
        - time: object
            - start: (number) start minute of room. Must be within 0-1439
            - end: (number) end minute of room. Must be within 0-1439
- response: 200
    - body: Added room booking successfully
- response: 400
    - body: Room is unavailable to be booked for this time and day
 - response: 400
    - body: Invalid input
- response: 401
    - body: Access Denied
```
$ curl  -X POST 
        -H "Content-Type: application/json" 
        -d '{"roomId":"someRoomId",
             "day":"2019/01/01",
             "purposes":["personal"],
             "time":{"start":"0", "end":"1200"}
           }'
        -c cookie.txt 
        https://localhost:3000/api/rooms/book/
```
### View Images
- description: retrieving images stored in database
- request: `GET /api/image/:imageId`
- response: 200
    - content-type: `image/jpeg` or `image/png`
    - file: (image) stored image from the database
- response: 404
    - body: `Not an image` or `File does not exist`
- response: 500
    - body: Error Occurred
``` 
$ curl -X GET
       https://localhost:3000/api/image/someImageId/
``` 

###