# FROM node:16
FROM node:20.17.0
# FROM reactnativecommunity/react-native-android:9.0

# Install basic development tools
RUN apt update && apt install -y less man-db sudo

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# # init for VS Code
RUN mkdir -p /root/workspace /root/.vscode-server/extensions 

# Install eslint typescript expo
RUN npm install -g npm@10.8.2
RUN npm install -g eslint expo-cli @expo/ngrok@^4.1.0
RUN node --version && npm --version

COPY ./entrypoint.sh /tmp

ENV SHELL /bin/bash

ENTRYPOINT [ "/tmp/entrypoint.sh" ]