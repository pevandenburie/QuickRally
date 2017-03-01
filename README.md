Quick-Rally bot
===============

Spark Bot for quick CA Agile Rally access for **SPVSS Infinite Home project**.

It is based on the ["flint-bot"](https://github.com/flint-bot/flint) framework.

## Building the container

    $ docker build . -t quickrally

## Running the container

    $ export SPARK_TOKEN="Tm90aGluZyB0b..."
    $ export SPARK_WEBHOOK="http://myserver.com/flint"
    $ docker run -it -e SPARK_TOKEN -e SPARK_WEBHOOK -p 80:3001  quickrally

## References

[Spark API](https://spark.laravel.com/docs/3.0/api)
