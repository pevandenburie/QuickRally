Quick-Rally bot
===============

Spark Bot for quick CA Agile Rally access for **SPVSS Infinite Home project**.

It is based on the ["flint-bot"](https://github.com/flint-bot/flint) framework.

## Building the container

    $ docker build . -t quickrally

## Running the container

    $ export SPARK_TOKEN="Tm90aGluZyB0b..."
    $ export SPARK_WEBHOOKURL="http://myserver.com/flint"
    $ export RALLY_API_KEY="_GeUV8XARSxa9zLefh..."
    $ export MAILER_USER_PASSWORD="user:password"
    $ docker run -it -e SPARK_TOKEN -e SPARK_WEBHOOKURL -e RALLY_API_KEY -e MAILER_USER_PASSWORD -p 80:80  quickrally

## References

[Spark API](https://spark.laravel.com/docs/3.0/api)
