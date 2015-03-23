#CaMunity MVP

------

## About the project

Our aim is to set up a platform where photographers can find work, or where clients can find photographers to do some work, in a few simple steps.

The idea itself is fairly straight forward - it's essentially a market place. Client users will predominantly be able to upload jobs that they require a photgrapher for. They should be able to search the site, looking for the right person for the job and also be contacted by photographers that wish to express an interest in the job.

Photographers will have a profile page where they store their portfolio and can search for the site for any jobs that interest them. They should also be able to communicate with the client users to discuss the job.

The transaction process should be safe. We want the Client user to deposit their funds to Stripe Connect upon agreement of the job, for the money to be held and paid to the photographer upon completion of the job.

We plan to have some sort of progress timeline that allows each user to check the status of the job. This will be imperative for the transaction process - both users will need to state that the job has started, that the job is over, that the photos have been received and that they have reviewed the other user.

Once the job has been completed each user can review the other. This allows the users to build up stats and hopefully a positive reputation! Encouraging each user to receive more work.

The project itself extends to be quite large, but for this week we will be hoping to achieve the necessities for the website to be up and running.

------

## Components we plan on using

* Stripe Connect - to accept and transfer funds to the various users
* Hapi.js - as a framework for our node based app
* MongoDB/Mongo Lab/MongoJS - to store and manage our data and test our Test Driven Development (TDD) code
* Jade - a template engine for our views

------

## Plan for the week

We believe in re-using code, but also understanding it. We hope to be writing code whilst reviewing previous code and ensuring everyone in our group understands what is going.

Below is our first draft timetable for this week:

#### Monday
* Researching and beginning to implement a basic mechanism for taking payments and at a later stage transferring funds to the recipient.
* Writing acceptance tests for our user stories and actual tests for our TDD.

#### Tuesday
* Finish implementation of Stripe Connect.
* Continue on TDD, writing further tests and running them.
* Dependent on time, begin working on content management. 

#### Wednesday
* Begin, or continue depending on Tuesday's progress, working on content mangement - stuff like routing, servers and database set up.

#### Thursday
* Integrate our functionalities, such as editing profiles, chat/messaging system, our status manager etc.

#### Friday
* Make final amendments, ensure tests are passing and all code is understood.
