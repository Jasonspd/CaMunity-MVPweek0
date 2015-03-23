#Acceptance tests

## HOMEPAGE
* The homepage: it should exist, it should have our website name, it should load our images

* Login button: it should redirect you to the twitter authentication login page.


## LOGIN
* Once logged in: it should store Twitter user credentials in our database.

* Upon Successful login: it should redirect user to the correct profile page depending on whether they are a client or a photographer

* Login information: it should cache your login information so you remain logged in


## GENERAL PROFILE
* Profile page: it should exist

* Using Twitter information: it should populate the profile page

* Edit button: it should redirect you to a form where you can edit your page

* Form: it should populate information that exists in the database

* Adding/editing the form: it should make adds, updates and edits to the database

* New information: it should be displayed after saving


## PHOTOGRAPHER PROFILE
* Uploading profile photo: it should add to our database and update the existing photo, it should contain a contact button

* Uploading photographer portfolio: it should display on the profile, it should be able to be viewed appropriately with enlarging and view all capability


## CLIENT PROFILE
* Add job button: it should let you write in a job post, it should display the job on the client user's profile, it should contain a contact button


## JOBS
* Jobs page: it should list all the jobs Client users have created, it should allow you to apply for a job


## STATUS
* Status page: it should state the current progress of any job shared between a client and a photographer, it should contain 

## PAYMENTS
* Client paying page: it should prompt client to fill in details once job has been accepte by both parties, it should deposit money into Stripe account, it should hold the money until job is complete

* Upon completion: it should transfer the funds to the photographer