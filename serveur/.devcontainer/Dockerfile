FROM node:18

EXPOSE 3000

COPY ./entrypoint.sh /tmp
RUN chmod +x /tmp/entrypoint.sh

ENV SHELL /bin/bash

ENTRYPOINT [ "/tmp/entrypoint.sh" ]
