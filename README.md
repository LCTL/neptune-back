#Neptune - Docker Web UI

Neptune is a Docker Web UI. It can manage Docker machine, container, image and volume for remote machine or local machine. 

This project is not completed and under heavy development now. Please do not use this for production in this stage.

## Container Quickstart

1. `docker run -d --privileged -v /var/run/docker.sock:/var/run/docker.sock --name neptune-back lawrence0819/neptune-back`
2. `docker run -d -p 8080:8080 --link neptune-back:neptune-back --name neptune-front lawrence0819/neptune-front`

## Required Software

1. Node.js (https://nodejs.org/en/)
2. Docker Machine (https://docs.docker.com/machine/install-machine/)

## Developer Install

Recommend install **Oracle VirtualBox** for development. (https://www.virtualbox.org/)

**Backend:**

1. git clone https://github.com/lawrence0819/neptune-back
2. cd neptune-back
3. npm run dev

**Frontend:**

1. git clone https://github.com/lawrence0819/neptune-front
2. cd neptune-front
3. npm run dev
