# Разворачивание новой версии Kuzzle
## Требования
* Настроенный Yandex Cloud CLI
* Установленный Docker Desktop
* Подключенный кластер Kubernetes
## Подготовка образа
* Указать новую версию kuzzle в package.json, если нужно.
```
npm run docker npm install // если первый раз или есть новая верся Kuzzle
docker build -t kuzzle-startum:8 .
```
Где: 
* kuzzle-startum - название образа. Должно быть одно для каждого проекта.
* 8 - версия. При ошибке, нужно удалать образ с yndex Container Registry.
## Загрузка образа
```
yc container registry list # находим id реестра
+----------------------+--------+----------------------+
|          ID          |  NAME  |      FOLDER ID       |
+----------------------+--------+----------------------+
| crpdrnml2dc1034r7bn1 | rolder | b1ggljum7u5ge5bhgln4 |
+----------------------+--------+----------------------+
docker tag kuzzle-startum:8 cr.yandex/crpdrnml2dc1034r7bn1/kuzzle-startum:8 # присваиваем docker tag, который требует Yandex
docker push cr.yandex/crpdrnml2dc1034r7bn1/kuzzle-startum:8 # заливаем образ в Yandex Container Registrty
```
* Добавляем путь к образу в Kubernetes.
## Аутентификация Kubernetes в Yandex Container Registrty
```
# генерируем ключ доступа для сервисного аккаунта rolder
yc iam key create --service-account-name rolder -o key.json
>>>
id: ajeqodkenjro01s1t6d8
service_account_id: aje1ulkfaedmb4vapk5q
created_at: "2023-09-20T16:30:16.064646065Z"
key_algorithm: RSA_2048

# Подготавливаем файл $HOME/.docker/config.json
{
        "auths": {
                "cr.yandex": {                        
                }
        }
}

# авторизуемся в докере
cat key.json | docker login \
  --username json_key \
  --password-stdin \
  cr.yandex

>>> Login Succeeded

# проверяем
cat $HOME/.docker/config.json
>>> {
        "auths": {
                "cr.yandex": {
                        "auth": "anNvbl9rZXk6ewogICAiaWQiOiAiYWplcW9ka2VuanJvMDFzMXQ2ZDgiLAogICAic2VydmljZV9hY2NvdW50X2lkIjogImFqZTF1bGtmYWVkbWI0dmFwazVxIiwKICAgImNyZWF0ZWRfYXQiOiAiMjAyMy0wOS0yMFQxNjozMDoxN$
                }
        }
}

# создаем серкет Kubernetes
kubectl create secret generic yandex-cr-secret \  
  --namespace=startum-d2 \
  --from-file=.dockerconfigjson=$HOME/.docker/config.json \
  --type=kubernetes.io/dockerconfigjson

>>> secret/yandex-cr-secret created

# проверяем
k -n startum-d2 describe secrets yandex-cr-secret
>>>
Name:         yandex-cr-secret
Namespace:    startum-d2
Labels:       <none>
Annotations:  <none>

Type:  kubernetes.io/dockerconfigjson

Data
====
.dockerconfigjson:  3269 bytes

# добавляем в контейнер
spec:      
    containers:
        ....
    imagePullSecrets:
        - name: yandex-cr-secret
```

# Kuzzle Application

_An application running with [Kuzzle](https://github.com/kuzzleio/kuzzle)_

## Installation and run

Requirement:
 - Node.js >= 14
 - NPM >= 6
 - Docker
 - Docker-Compose

First, install [Kourou](https://github.com/kuzzleio/kourou), the Kuzzle CLI: `npm install -g kourou`

### Docker

First, you need then to install dependencies: `npm run docker npm install`

Then, start your application with `npm run docker:dev`

### Standalone

First, you need to start Kuzzle additional service: `npm run services`

Then, you need then to install dependencies: `npm install`

Finally, start your application with `npm run dev`

## Manipulating NPM through Docker

It's important to install NPM packages from inside the container to avoid Node.js mismatch errors.

Those errors may appear when
 - the Node.js version installed on your computer is not the same as the one used in our Docker containers
 - your computer use a different version of the GLIBC
 - your computer use a different CPU architecture (e.g. MacOS use Darwin)

To prevent those errors, you can use the following commands
 - `npm run docker` run any command into the container context (e.g. `npm run docker ls`)
 - `npm run docker npm install` run a standard `npm install` (e.g. `npm run npm install axios`)
 - `npm run docker npm rebuild` run a standard `npm rebuild`
 - etc.

## Troubleshooting

### NODE_MODULE_VERSION mismatch

This message indicate that you may try to run your Kuzzle application with a different Node.js version from the one you used to build the application.

Try to rebuild dependencies from inside your Docker container with: `npm run docker npm rebuild`

**Symptoms:**
```
kiotp_node_2     | > kuzzle-iot-platform@1.0.0 dev /var/app
kiotp_node_2     | > NODE_ENV=development ergol start.ts -c ergol.config.json
kiotp_node_2     |
kiotp_node_2     | Debugger listening on ws://0.0.0.0:9229/58d23bb2-d8fb-4fc0-b328-df52eaa27273
kiotp_node_2     | For help, see: https://nodejs.org/en/docs/inspector
kiotp_node_2     | Error: The module '/var/app/node_modules/murmurhash-native/lib/Release/murmurhash.node'
kiotp_node_2     | was compiled against a different Node.js version using
kiotp_node_2     | NODE_MODULE_VERSION 93. This version of Node.js requires
kiotp_node_2     | NODE_MODULE_VERSION 83. Please try re-compiling or re-installing
kiotp_node_2     | the module (for instance, using `npm rebuild` or `npm install`).
```
