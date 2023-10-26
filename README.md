##  REQUIREMENTS

The Scraper uses Mongodb as the secondary database and Redis as the Primary database, specifically using Redis-streams to store events, then computing it into Mongodb, this is a streamlined version of CQRS. It also uses BullMq as the Queue handler.

You should have Redis and Mongodb installed locally

You can also install the bull-cli to view items in the queue

```sh
    npm install -g bull-cli
```

## USING DOCKER

You can simply run the full application with ```sh docker compose up --build``` and it will start the server up and it will be available to use at `http//localhost:3000`.

## INSTALLATION

You should install the dependencies using npm
```sh
    npm install
```

## USAGE

You can change most of the configurations used in the ./src/types/constants.ts, the scraper currently scrapes in the range of 1000. You can increase this as required.

### Scraper

- You can run the scraper using ```sh npm run scrape```, this will look at the last ran block from our Cache and update the Redis-stream and our mongo database accordingly. 
- During the optional case where blocks fail, the queue will automatically retry the job 2 more times before it eventually fails and job will be logged in the stdout and these blocks can be retried using ```sh npm run scrape $startblock $endblock```. Only failed blocks can be retried this way to avoid adding events from a different range.
NB: When using docker to run the application, you should run these commands in the `lifi-test-api` container. e.g ```sh docker exec lifi-test-api npm run scrape```.

### Server

The server can be run using ```sh npm run start```, this will start up our server which has access to one endpoint to fetch all events.
You can fetch all events using `GET http://localhost:3000/events?integrator=$integrator`.


### Redis-Stream

You can look into your primary database to view the current streams that has been added to the database.
- Go into Redis console```sh redis-cli```
- Run the command ```sh XREAD STREAMS $STREAM_NAME 0-0```

### Queue

You can also look at failed or completed jobs in the queue, or blocks that get stuck in the queue. Each queue uses a custom id of the block range `$startBlock-$endBlock`, you can check the stats and see what blocks fail and retry them from the command line without running the scraper. Using the scraper is recommended however.

- Go to the queue console ```sh bull-repl```
- Connect to the queue ```sh connect $QUEUE_NAME```
- Run ```sh stats``` to see completed or failed jobs
- Run ```sh retry id($startBlock-$endBlock)```


## To be completed
- Refactoring, Cleaning up Typescript and jsdocs.
- Proper error handler for the server.