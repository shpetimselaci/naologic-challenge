FROM node:22-slim as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm config set store-dir /pnpm/store/v3 --global
RUN apt-get update && apt-get install -y procps
COPY ./ /home/server
WORKDIR /home/server

FROM base as install

RUN mkdir -p /temp/dev/

COPY package.json pnpm-lock.yaml /temp/dev/

RUN cd /temp/dev/ && pnpm install --frozen-lockfile

FROM install as run

RUN cd /home/server

COPY --from=install /temp/dev/package.json /temp/dev/pnpm-lock.yaml  ./
COPY --from=install /temp/dev/node_modules node_modules

ENTRYPOINT ["sleep", "infinity"]