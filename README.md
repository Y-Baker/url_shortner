# WORKSHOP: How to start Backend Project

2. ### Getting Ready for the Project
    - What problem does the application solve?
    - Who are the target users?
    - What features are required in the backend? (MVP)
    - What technologies will be used? (Programming Language, Framework, Database, etc.)

<br />

## Project Idea (URL Shortener):
A service that takes a long URL and generates a short version (like bit.ly).
- Algorithm to generate short URL
- Store long URL and short URL in the database
- getting the long URL based on the short URL

## Getting Started
1. #### Clone the repository
    ```bash
    git clone https://github.com/Y-Baker/url_shortner.git
    ```

2. #### Change the directory
    ```bash
    cd url_shortner
    ```
3. #### Install the dependencies
    ```bash
    npm install
    ```

4. #### Start the server
    ```bash
    npm run start
    ```

5. #### Open Swagger UI
    - Open the browser and go to `http://localhost:5000/api-docs`




### API Endpoints
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/shorten` | Create a short URL |
| GET | `/{short_url}` | Redirect to the long URL |
| GET | `/{short_url}/info` | Get the long URL based on the short URL |

