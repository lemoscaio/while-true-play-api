<!-- HEADER -->
<div>
<div align="center">
  <img  src="https://i.imgur.com/2markIU.png"
    width=100%" >
</div>
<br>
<h1 align="center">
  While (true) Play Store - API
</h1>
<div align="center">
  <h3>Built With</h3>
  <img alt="NodeJS badge" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" height="30px"/>  
  <img alt="ExpressJS badge" src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express.js&logoColor=white" height="30px"/>
  <img alt="JWT Badge" src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" height="30px"/>
  <img alt="MongoDB badge" src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" height="30px"/>
  <img alt="Heroku badge" src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white" height="30px"/>
  <!-- Badges source: https://dev.to/envoy_/150-badges-for-github-pnk -->
</div>
<br/>
</div>

<!-- CONTENT -->
## Description

API for the While (true) Play website. While (true) Play is a mock store website for games. This API was built using NodeJS, Express and MongoDB to manage transaction users, games and orders. 

 It was the 14ᵗʰ project developed during the Driven Full Stack Bootcamp in pairs (see contributors in the end).

## Features

- Authentication routes for registering and logging in
  - Users created with an encrypted password and persisted to the database
  - Password strength validation
  - User session persisted to the database and validated with JWT via middleware
- Games search with queries strings such as filter, order, limit
- Game search via id with view increment for each request
- Order confirmation via email with SendGrid (it doesn't have payment support since it's just a mock project)
- Responsabilities divided between routes and controllers
- All data stored on a MongoDB database
- All the entries are validated against schemas

## API Reference

### Models

  #### Game:

  ```typescript
  {
    "title": string,
    "images": {
      "cover": string,
      "screenshots": string[]
    },
    "description": string,
    "genre": string[],
    "views": number,
    "price": number,
    "reviews": string[],
    "id": number,
    "amountSold": number,
    "discountAmount": number,
    "hasDiscount": boolean,
    "releaseDate": Date
  }
  ```

  `Ps: most of the times this data will be just passed along the application`

### Users

* #### Create new user
  
  ```http
  POST /sign-up
  ```

  ##### Request body:

  | Body       | Type     | Description                   |
  | :--------- | :------- | :---------------------------- |
  | `name`     | `string` | **Required** - Valid name     |
  | `email`    | `string` | **Required** - Valid email    |
  | `password` | `string` | **Required** - Valid password |

  `password length: from 6 to 20 characters`

  ##### Example: 
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  } 
  ```

* #### Login user

  ```http
  POST /sign-in
  ```

  ##### Request:

  | Body       | Type     | Description                   |
  | :--------- | :------- | :---------------------------- |
  | `email`    | `string` | **Required** - Valid email    |
  | `password` | `string` | **Required** - Valid password |

  `password length: from 6 to 20 characters`

  ##### Example: 
  ```json
  {
    "email": "string",
    "password": "string"
  } 
  ```

  ##### Response:

  ```json
  "token string"
  ```

* #### Get user info

  ```http
  GET /user
  ```
    
  ##### Headers:

  | Name            | Description                       |
  | :-------------- | :-------------------------------- |
  | `authorization` | **Required** - "Bearer {{token}}" |

  ##### Response:

  ```json
  {
    "name": "string",
    "email": "string",
    "image": "string",
    "games": "Game[]"
  }
  ```

  `Game[] is an array of Game objects. See the section "Models" for more information`

* #### Add game to user cart

  ```http
  POST /cart
  ```

  ##### Request:

    | Body   | Type   | Description               |
    | :----- | :----- | :------------------------ |
    | `game` | `Game` | **Required** - Game model |


  ##### Example: 

  ```json
  {
    "_id":"627b0e140e66b143feacb54f",
    "title":"Elden Ring",
    "images":{
      "cover":"https://cdn.akamai.steamstatic.com/steam/apps/1245620/capsule_616x353.jpg?t=1649774637",
      "screenshots":
      [
        "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_e80a907c2c43337e53316c71555c3c3035a1343e.600x338.jpg?t=1649774637",
        "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_ae44317e3bd07b7690b4d62cc5d0d1df30367a91.600x338.jpg?t=1649774637"
        "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_1011610a0e330c41a75ffd0b3a9a1bac3205c46a.600x338.jpg?t=1649774637"
      ]
    },
    "description":"THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
    "genre":[
      "Action", "RPG"
    ],
    "views":460,
    "price":249.9,
    "reviews":[],
    "id":4,
    "amountSold":27,
    "discountAmount":0,
    "hasDiscount":"false",
    "releaseDate":"2022-02-24T00:00:00-03:00"
  } 
  ```

  
  ##### Headers:

  | Name            | Description                       |
  | :-------------- | :-------------------------------- |
  | `authorization` | **Required** - "Bearer {{token}}" |

### Games

* #### Get all games

  ```http
  GET /games
  ```

  ##### Query strings:

  | Parameter | Type     | Description           |
  | :-------- | :------- | :-------------------- |
  | `q`       | `string` | FIlter query          |
  | `limit`   | `number` | Limit response amount |
  | `order`   | `enum`   | `desc` or `asc`       |


  ##### Response:

  ```json
  [
    {
      "_id": "627b0e140e66b143feacb54b",
      "title": "Project Zomboid",
      "images": {
        "cover": "https://www.mobygames.com/images/covers/l/326473-project-zomboid-linux-front-cover.jpg",
        "screenshots": [
          "https://images.gog-statics.com/756e29173677fafc8dd206623f74582a076b17d2dce1021d093c658d43cd4b73.jpg",
          "https://images.gog-statics.com/6dcf744d35a5623741c7607cdf07b587388b05234346cd262a19973a6c4d9370.jpg",
          "https://images.gog-statics.com/ecbbfb41e8035bbe199af981c04703742efba60c0bfd3f591dcf131ec7fbb665.jpg"
        ]
      },
      "description": "Project Zomboid is an open-ended zombie-infested sandbox. It asks one simple question – how will you die?\nIn the towns of Muldraugh and West Point, survivors must loot houses, build defences and do their utmost to delay their inevitable death day by day. No help is coming – their continued survival relies on their own cunning, luck and ability to evade a relentless horde.",
      "genre": [
        "Action",
        "Simulation",
        "Open World"
      ],
      "views": 192,
      "price": 37.99,
      "reviews": [],
      "id": 0,
      "amountSold": 21,
      "discountAmount": 0.33,
      "hasDiscount": true,
      "releaseDate": "2023-11-08T00:00:00-03:00"
    }
  ]
  ```

* #### Find game by ID

  ```http
  GET /games/{id}
  ```

  ##### Path parameters:

  | Parameter | Description            |
  | :-------- | :--------------------- |
  | `id`      | **Required** - Game id |

  `PS: You must pass the game id property, not _id`

  ##### Response:

  ```json
  {
    "_id": "627b0e140e66b143feacb54b",
    "title": "Project Zomboid",
    "images": {
      "cover": "https://www.mobygames.com/images/covers/l/326473-project-zomboid-linux-front-cover.jpg",
      "screenshots": [
        "https://images.gog-statics.com/756e29173677fafc8dd206623f74582a076b17d2dce1021d093c658d43cd4b73.jpg",
        "https://images.gog-statics.com/6dcf744d35a5623741c7607cdf07b587388b05234346cd262a19973a6c4d9370.jpg",
        "https://images.gog-statics.com/ecbbfb41e8035bbe199af981c04703742efba60c0bfd3f591dcf131ec7fbb665.jpg"
      ]
    },
    "description": "Project Zomboid is an open-ended zombie-infested sandbox. It asks one simple question – how will you die?\nIn the towns of Muldraugh and West Point, survivors must loot houses, build defences and do their utmost to delay their inevitable death day by day. No help is coming – their continued survival relies on their own cunning, luck and ability to evade a relentless horde.",
    "genre": [
      "Action",
      "Simulation",
      "Open World"
    ],
    "views": 192,
    "price": 37.99,
    "reviews": [],
    "id": 0,
    "amountSold": 21,
    "discountAmount": 0.33,
    "hasDiscount": true,
    "releaseDate": "2023-11-08T00:00:00-03:00"
  }
  ```

### Checkout

* #### Buy games

```http
POST /checkout
```

##### Request:

| Body | Type    | Description                         |
| :--- | :------ | :---------------------------------- |
|      | `Array` | **Required** - Array of Game models |

##### Example: 

  ```json
  [
    {
      "_id":"627b0e140e66b143feacb54f",
      "title":"Elden Ring",
      "images":{
        "cover":"https://cdn.akamai.steamstatic.com/steam/apps/1245620/capsule_616x353.jpg?t=1649774637",
        "screenshots":
        [
          "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_e80a907c2c43337e53316c71555c3c3035a1343e.600x338.jpg?t=1649774637",
          "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_ae44317e3bd07b7690b4d62cc5d0d1df30367a91.600x338.jpg?t=1649774637"
          "https://cdn.akamai.steamstatic.com/steam/apps/1245620/ss_1011610a0e330c41a75ffd0b3a9a1bac3205c46a.600x338.jpg?t=1649774637"
        ]
      },
      "description":"THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
      "genre":[
        "Action", "RPG"
      ],
      "views":460,
      "price":249.9,
      "reviews":[],
      "id":4,
      "amountSold":27,
      "discountAmount":0,
      "hasDiscount":"false",
      "releaseDate":"2022-02-24T00:00:00-03:00"
    }
  ]
  ```

## Run Locally

Clone the project:

```bash
git clone https://github.com/lemoscaio/while-true-play-api.git
```

Go to the project directory:

```bash
cd while-true-play-api
```

Install dependencies:

```bash
npm install
```

Set up the environment variables in the `.env` file, using the `.env.example`.

Make sure the MongoDB server is running and available.

Start the server:

```bash
node index.js
```

## Lessons Learned

In this project I learned the following:
* to build a store and manipulate data such as how to manage user cart
* to use JWT

## Acknowledgements

-   [Awesome Badges](https://github.com/Envoy-VC/awesome-badges)

### Contributors

<a href="https://github.com/lemoscaio/while-true-play-api/graphs/contributors">
  <img src="https://i.imgur.com/FCs51ZS.png" width="80"">
  <img src="https://i.imgur.com/GGWjPrM.png" width="80"">
</a>
