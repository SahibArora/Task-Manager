Task Manager API 

This API will allow any user to perform following actions -

1. {{url}}/Users {POST request} - To create a new User.
2. {{url}}/users/login {POST request} - To login with existed User
3. {{url}}/me/avatar {POST request} - To upload your Avatar
4. {{url}}/tasks {POST request} - To create an associated Task to logged in user.
5. {{url}}/users/me {GET request} - To get current user.
6. {{url}}/tasks?sortBy=completed:asc {GET request} - To get associated Tasks using filters
7. {{url}}/users/me {PATCH request} - To update the current user.
8. {{url}}/tasks/:id {PATCH request} - To update current user's selected Task
9. {{url}}/tasks/:id {DELETE request} - To delete tasks
10. {{url}}/users/me/avatar {DELETE request} - To delete Avatar associated to current user
11. {{url}}/users/logout {POST request}- To logout from current device or most recent login
12. {{url}}/users/logoutall {POST request} - To logout from all the devices or all logins
13. {{url}}/users/me {DELETE request} - To delete the current user.

An Auth middleware has been written to check for authentication, So, to use any of the features above, first create the user.

Access Application @ https://task-manager-api-sahib.herokuapp.com
