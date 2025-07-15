# SmartHomeDashboard

Part of our final project in DevSecOps course at Bar-Ilan
University ([Main project repository](https://github.com/NadavNV/SmartHomeConfig)). The project allows viewing and
managing different Smart home devices such as lights, water heaters, or air conditioners.

It is divided into several microservices, and this microservice is the frontend dashboard. This is where the user can
view and change the various devices.

## Technologies Used

| Layer            | Technology |
| ---------------- | ---------- |
| **UI Framework** | React      |
| **Build Tool**   | Vite       |
| **Web Server**   | nginx      |

## Requirements

- A working [backend instance](https://github.com/NadavNV/SmartHomeBackend).
- [node.js](https://nodejs.org/en)

## Usage

- To run on your local machine:
  - Make sure you have node.js installed and a running backend instance.
  - Clone this repo:
    ```bash
    git clone https://github.com/NadavNV/SmartHomeDashboard.git
    cd SmartHomeDashboard
    ```
  - Run `npm install`.
  - Edit the value of `proxy_pass` in `nginx.conf` to the address of your backend.
  - Set an environment variable named `VITE_API_URL` whose value is the full address of the backend instance, including
    port
    (e.g. `http://localhost:5200`).
  - Run `npm run build`.
  - Run `npm run preview`.
- To run in a Docker container:
  - Make sure you have a running backend instance and a running Docker engine.
  - Clone this repo:
    ```bash
    git clone https://github.com/NadavNV/SmartHomeDashboard.git
    cd SmartHomeDashboard
    ```
  - Run `docker build --build-arg "VITE_API_URL=<full backend address>" -t <name for the image> .`.
  - Run `docker run -p 3001:3001 -e "BACKEND_URL=<full backend address, without http://> <image name>`.
