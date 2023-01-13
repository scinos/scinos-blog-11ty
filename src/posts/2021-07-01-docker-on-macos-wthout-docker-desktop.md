---
tags:
  - docker
  - macos
---

# Docker on macOS without Docker Desktop

After the recent announcement from Docker that Docker Desktop for Mac won't be free anymore, I tried to find an
alternative to run my Docker containers.

These are the raw instructions to get it running with [Multipass](https://multipass.run/):

```bash
# Install multipass
brew install multipass
multipass launch -v --cpus 8 --mem 8G --disk 80G --name docker
multipass exec docker -- bash

# Update system
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install build-essential -y

# Fix DNS
Edit /etc/systemd/resolved.conf
	[Resolve]
	DNS=8.8.8.8
	FallbackDNS=1.1.1.1
systemctl restart systemd-resolved

# Install docker
sudo systemctl edit docker.service
curl -sSL https://get.docker.com/ | sh
sudo usermod -aG docker $USER

# Configure Docker
sudo systemctl edit docker.service
	[Service]
	ExecStart=
	ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2375
sudo systemctl daemon-reload
sudo systemctl restart docker.service

# Install client on OSX
# (Outside multipass)
Do https://docs.docker.com/engine/install/binaries/#install-client-binaries-on-macos

# Configure it to always use -H
Get the ip from `multipass info docker`
Add export DOCKER_HOST=192.168.64.7 to your ~.bashrc or equivalent

# Test it
docker run hello-world
```
