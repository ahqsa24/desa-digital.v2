## Installation

To get started with the Desa Digital App, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Adsattt/desa-digital.v2.git
    cd desa-digital.v2
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env.local` file in the root directory of your project and add the following line:

    ```
    VITE_FIREBASE_APIKEY=
    VITE_FIREBASE_AUTH_DOMAIN=
    VITE_FIREBASE_PROJECT_ID=
    VITE_FIREBASE_STORAGE_BUCKET=
    VITE_FIREBASE_MESSAGE_SENDER_ID=
    VITE_FIREBASE_APP_ID=
    ```

    Fill in with the firebase configuration you are using.

## Running the Application

To run the application on your local machine:

```bash
npm run dev
