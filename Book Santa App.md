# Book Santa App

1. Administrator: 
   Wants users to sign-up or login as authenticated users.
   Wants to limit the requests by a user.

2. User:
   Wants to put in a request for a book by filling up a form.
   The form should also have a reason for request.
   Wants to receive a notification when a request gets fulfilled.
   Wants to confirm that the book has been received.
   Wants to have an option to thank the book donor.

3. Donor:
   Wants to look at the active book requests.
   Wants to look at the reason of the request.
   Wants to have the option to filter the book requests.
   Wants to look at the address of the user so the book can be sent.
   Wants to be able to order the book send it directly to the user from Amazon portal within the app.
   Wants to send an update/notification to the user that the book has been sent.
   Wants to be notified that the book has been received.

4. User's workflow:
   User has to signup for the app
   The user logs in to their account
   Bottom tabs for "Donate" and "Request".
   The user will click on "Request".

   if(user !== pendingRequests) {

   bookRequestForm()
   } else {

   requestDenied()
   }
   if(firstTimeRequest) {

   FillUpAddressEtc()
   } else if (user !== pendingRequests){

   bookRequestForm()
   } else {

   pleaseTakeCareOfYourEarlierRequest()

   }

   The user will click on the submit button and can see his/her request live on the app.

5. Donor's workflow:
   Donor has to signup for the app
   The donor logs in to their account
   Bottom tabs for "Donate" and "Request".
   The donor will click on "Donate".
   Can filter the requests.
   Can select which request he wants to fulfil.
   Can send the books from his/her house or order and send the book to the user's house directly from the Amazon window within the app.
   Receives notification when the book has reached
   Receives thanks from the user