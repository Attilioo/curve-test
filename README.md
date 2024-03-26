# Curve Tech assessment

The repository for my Full Stack Developer Assessment.

## How to Run this project:

To run this project on another machine you will need to install a few components.
Follow these steps:

1. **Install Node.js and NPM**: Ensure that Node.js and NPM (Node Package Manager) are installed.https://nodejs.org/

2. **Clone the Project**: Clone the project from its repository to your local machine using GitHub.

3. **Install Dependencies**: Navigate to the project directory in the terminal and run the command `npm install`.

4. **Set up MongoDB**: The project uses MongoDB as its database. You can either install MongoDB locally or use MongoDB Atlas, which is a cloud-based database service.

   - For local installation, download MongoDB from the official website: https://www.mongodb.com/try/download/community and install it. After installation, you need to create a new database named `curve-tech-test`.

   - For MongoDB Atlas, create an account and a new cluster. Then, create a new database named `curve-tech-test`. MongoDB Atlas will provide a connection string that you can use in your project.

5. **Update Database Connection String**: In the project files, create a file named '.env'.

Inside this file you will need to add this:
`MONGODB_URL=mongodb://localhost/curve-tech-test`

Replace the connection string with your local or Atlas connection string.

6. **Run the Project**: In the terminal, navigate to the project directory and run `node index.js` to start the application.

Alternatively you can run the tests by typing `npm run test`

## Acknowledgements

Thank you for the opportunity to complete this task. It was a really fun challenge finding my way around the tasks.

Hope to hear from you soon!
