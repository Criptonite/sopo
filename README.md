# setup gitlab 
Создадим виртуальную машину с установленной на нее ubuntu server. Настроим на машине bridge adapter. 
Подключимся по ssh и установим докер
Выполним команду на запуск 
![](https://github.com/Criptonite/sopo/blob/master/images/start_gitlab.png)
![](https://github.com/Criptonite/sopo/blob/master/images/gitlab.png)

# ansible
**Необходимо:** развернуть apache2 и прокинуть html темлпейт на машины

#### Установка ансибл на рабочий ПК и подготовка к работе:
Моей рабочей сисстемой является OS X. Дополнительно развернуто две виртуальные машины с двумя сетевыми интерфейсами NAT и виртуальный адаптер хоста. Для установки ansible на рабочем ПК необходимо выполнить всего одну команду:
```bash
brew install ansible
```
Для работы был [форкнут](https://github.com/kost2191/sopo) репозиторий, с уже готовой файловой иерархией.
Пропишем ip машин для прокатки плейбука (sopo/ansible/environments/machines/inventory):
```
[machines]
gudmian.ubuntu.server ansible_ssh_private_key_file=~/.ssh/id_lab_rsa ansible_ssh_host=192.168.56.3 ansible_ssh_user=gudmian
gudmian.ubuntu.agent ansible_ssh_private_key_file=~/.ssh/id_lab_rsa ansible_ssh_host=192.168.56.101 ansible_ssh_user=gudmian-agent
```
Создадим простой плейбук, который будет прокатывать единственную роль:
```
---
- hosts: all
  become: yes
  roles:
    - ansible
```
Теперь укажем ансиблу, откуда нужно брать необходимую для прокатки роль:
```
#ansible role
- src: https://github.com/Criptonite/ansible.git
  scm: git
  version: main
```
Ансибл настроен для прокатки плейбука. Теперь нужно прокинуть ssh ключи на обе машины для прокатки, чтобы ансибл мог подключиться без запроса пароля

#### Пробрасывание ssh ключей:
Сгенерируем ключ командой: 
> ssh-keygen -t rsa. 

Пароль указывать не будем.
Затем пробросим ключ на обе машины:
> ssh-copy-id -i ~/.ssh/id_lab_key.pub gudmian@192.168.56.3
ssh-copy-id -i ~/.ssh/id_lab_key.pub gudmian-agent@192.168.56.101

Теперь мы можем подключаться к машинам по ssh без ввода пароля.
#### Скрипт для прокатки:
В отдельном [репозитории](https://github.com/Criptonite/ansible) реализуем скрипт для прокатки.
```
---
- name: install apache
  apt:
    name: apache2
    state: latest
  become: yes
- name: add index.html
  template:
    src: templates/index.j2
    dest: /var/www/html/index.html
  become: yes
- name: restart apache
  service:
    name: apache2
    state: restarted
    enabled: yes
  become: yes
```
Данный скрипт устанавливает apache2, добавляет шаблонный файл index.html в каталог страниц, в который смотрит сервер. Для того, чтобы apache2 подхватил изменения, последним шагом необходимо перезапустить сервис.
#### Резульат:
Для начала необходимо, чтобы ансибл подтянул роли. Для этого выполним команду 
> ansible-galaxy -r roles/requirenments.yml --force

![](https://github.com/Criptonite/sopo/blob/master/images/ans_ins_roles.png)
Теперь необходимо прокатить плейбук:
> ansible-playbook -i ./environments/machines/inventory ./playbooks/ansible.yml

![](https://github.com/Criptonite/sopo/blob/master/images/ans_playbook.png)
Для проверки перейдем из браузера по ip адрессам обеих машин:
![](https://github.com/Criptonite/sopo/blob/master/images/ans_res_1.png)
![](https://github.com/Criptonite/sopo/blob/master/images/ans_res_2.png)
#### Исходный код:
[Исходный код](https://github.com/Criptonite/sopo/tree/master/ansible)
***
# docker
**Необходимо:** подготовить и собрать Docker контейнер для запусска веб приложения на angular
Для демонстрации работы докера было решено собрать контенер, содержащий приложение на angular, которое было написано ранее. Код докер файла и кода приложения можно будет найти в пункте "Исходный код"
#### Скрипт для сборки образа
```dockerfile
FROM mhart/alpine-node:12
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app
COPY package-lock.json /app
RUN npm install
RUN npm install -g @angular/cli@11.0.3
COPY . /app
EXPOSE 4200
CMD ng serve --host 0.0.0.0
```
#### Сборка
> docker build -t mydocker .

результат:
```
gudmian-osx:docker gudmian$ docker build -t nosqlui:dev .
Sending build context to Docker daemon  487.4kB
Step 1/10 : FROM mhart/alpine-node:12
 ---> b13e0277346d
Step 2/10 : WORKDIR /app
 ---> Using cache
 ---> f8377744476b
Step 3/10 : ENV PATH /app/node_modules/.bin:$PATH
 ---> Using cache
 ---> 410667809bdc
Step 4/10 : COPY package.json /app
 ---> ad1cae77ed0d
Step 5/10 : COPY package-lock.json /app
 ---> 5f580f2ea474
Step 6/10 : RUN npm install
 ---> Running in ab43b78f98bd
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.4 (node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.4: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: node-sass@4.9.3 (node_modules/node-sass):
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: node-sass@4.9.3 postinstall: `node scripts/build.js`
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: Exit status 1
added 1028 packages from 1322 contributors and audited 1160 packages in 24.135s
found 2340 vulnerabilities (1709 low, 11 moderate, 618 high, 2 critical)
  run `npm audit fix` to fix them, or `npm audit` for details
Removing intermediate container ab43b78f98bd
 ---> 57edb68a0a80
Step 7/10 : RUN npm install -g @angular/cli@11.0.3
 ---> Running in b98a3bd73e4b
npm WARN deprecated debug@4.2.0: Debug versions >=3.2.0 <3.2.7 || >=4 <4.3.1 have a low-severity ReDos regression when used in a Node.js environment. It is recommended you upgrade to 3.2.7 or 4.3.1. (https://github.com/visionmedia/debug/issues/797)
npm WARN deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
npm WARN deprecated har-validator@5.1.5: this library is no longer supported
/usr/bin/ng -> /usr/lib/node_modules/@angular/cli/bin/ng
> @angular/cli@11.0.3 postinstall /usr/lib/node_modules/@angular/cli
> node ./bin/postinstall/script.js
+ @angular/cli@11.0.3
added 254 packages from 201 contributors in 18.114s
Removing intermediate container b98a3bd73e4b
 ---> 7c2d5bb1ddcd
Step 8/10 : COPY . /app
 ---> dca7116a270c
Step 9/10 : EXPOSE 4200
 ---> Running in 54425705f85c
Removing intermediate container 54425705f85c
 ---> 0066b3e54ebc
Step 10/10 : CMD ng serve --host 0.0.0.0
 ---> Running in cb2891ae17a4
Removing intermediate container cb2891ae17a4
 ---> 700cab34ccb2
Successfully built 700cab34ccb2
Successfully tagged nosqlui:dev
```
#### Результат:
Теперь, когда наш образ готов, мы можем запустить контейнер и посмотреть на результат
> docker run -v /app/node_modules -p 4201:4200 --rm nosqlui:dev

вывод
```
** Angular Live Development Server is listening on 0.0.0.0:4200, open your browser on http://localhost:4200/ **

Date: 2020-12-08T20:09:37.019Z
Hash: b2d1237365b9b42fb30a
Time: 10182ms
chunk {default~modules-charts-module-charts-module~modules-map-tab-module-map-tab-module~modules-uploader-m~0c39ce51} default~modules-charts-module-charts-module~modules-map-tab-module-map-tab-module~modules-uploader-m~0c39ce51.js, default~modules-charts-module-charts-module~modules-map-tab-module-map-tab-module~modules-uploader-m~0c39ce51.js.map (default~modules-charts-module-charts-module~modules-map-tab-module-map-tab-module~modules-uploader-m~0c39ce51) 1.46 MB  [rendered]
chunk {main} main.js, main.js.map (main) 18.4 kB [initial] [rendered]
chunk {modules-charts-module-charts-module} modules-charts-module-charts-module.js, modules-charts-module-charts-module.js.map (modules-charts-module-charts-module) 22.3 kB  [rendered]
chunk {modules-map-tab-module-map-tab-module} modules-map-tab-module-map-tab-module.js, modules-map-tab-module-map-tab-module.js.map (modules-map-tab-module-map-tab-module) 52.2 kB  [rendered]
chunk {modules-uploader-module-uploader-module} modules-uploader-module-uploader-module.js, modules-uploader-module-uploader-module.js.map (modules-uploader-module-uploader-module) 16.9 kB  [rendered]
chunk {polyfills} polyfills.js, polyfills.js.map (polyfills) 227 kB [initial] [rendered]
chunk {runtime} runtime.js, runtime.js.map (runtime) 9.47 kB [entry] [rendered]
chunk {scripts} scripts.js, scripts.js.map (scripts) 403 kB  [rendered]
chunk {styles} styles.js, styles.js.map (styles) 270 kB [initial] [rendered]
chunk {vendor} vendor.js, vendor.js.map (vendor) 3.98 MB [initial] [rendered]
ℹ ｢wdm｣: Compiled successfully.
```
Перейдем на localhost:4201:
![](https://github.com/Criptonite/sopo/blob/master/images/dockerfile_res.png)

#### Исходный код:
[Исходный код](https://github.com/Criptonite/sopo/tree/master/docker)
***
# gitlab-ci
**Необходимо:** Развернуть на сервере docker-контейнер с gitlab-ee. Импортировать репозиторий с лабораторной по ansible в gitlab. Настроить gitlab-ci в gitlab. Написать job, который будет выполнять прокатку ansible-playbook. Установить и зарегистрировать gitlab-runner на машине-агенте. Прогнать настроенную джобу через gitlab-ci по пушу в репозиторий.  
#### Настройка job
Развернем gitlab в docker-contatiner на машине 192.168.56.3. Через интерфейс gitlab импортируем себе [репозиторий с лабораторной по ansible](https://github.com/Criptonite/sopo/tree/master).
![](https://github.com/Criptonite/sopo/blob/master/images/gitlab_ci_imported.png)
Создадим файл .gitlab-ci.yml в корне репозитория (содержимое файла можно посмотреть в разделе "Исходный код")
Пайплайн не запускается т.к. нет зарегистрированных раннеров.
#### Регистрация gitlab-runner
На машине 192.168.56.101 установим и запустим раннер. При регистрации укажем следующие настройки:
```
root@gudmianagent-VirtualBox:/home/gudmian-agent# cat /etc/gitlab-runner/config.toml 
concurrent = 1
check_interval = 0

[session_server]
  session_timeout = 1800

[[runners]]
  name = "gudmian-ci"
  url = "http://192.168.56.3/"
  token = "1-i1Q4Dym4XxErkiWMqy"
  executor = "shell"
  [runners.custom_build_dir]
  [runners.cache]
    [runners.cache.s3]
    [runners.cache.gcs]
    [runners.cache.azure]
```
Пробросим ключи между user@gudmian-agent и user@gitlab-runner, чтобы ansible работал корректно. Для того, чтобы джоба прошла успешно, необходимо подключиться c gitlab-runner на gudmian-agent и разрешить использовать ssh при подключении. Для машины-агента также необходимо установить git и ansible. Также, для выполнения ansible-ом действий с разрешениями суперпользователя в инструкциях джобы передается пароль суперпользователя через переменные ansible (способ конечно не очень хороший, но приемлемый для лабораторной). После выполнения данных действия, gitlab-ci заработал корректно.
#### Результат:
![](https://github.com/Criptonite/sopo/blob/master/images/gitlab_ci_passed.png)
![gif](https://github.com/Criptonite/sopo/blob/master/images/gitlab_ci_pass_gif.gif)
#### Исходный код:
[Исходный код](https://github.com/Criptonite/sopo/blob/master/.gitlab-ci.yml)
***
# jenkins
**Необходимо:** Развернуть на сервере docker-контейнер с jenkins. Подключить агента и написать скрипт для job, который будет выполнять прокатку ansible-playbook. Прогнать настроенную job через jenkins.
#### Настройки сервера
На машине 192.168.56.3 развернем docker контейнеры по инструкции с официального сайта. Перейдем с управляющей машины на 192.168.56.3:8080 и увидим вебморду jenkins.
#### Настройка агента
Создадим группу и пользователя jenkins. Пробросим данному пользователю ключи для подключения по ssh. Переключимся на пользвателя jenkins и соединимся по ssh с gudmian-agent. Затем через панель управления добавим агента в jenkins. Выберем авторизацию по ключу и добавим ключ. 
![](https://github.com/Criptonite/sopo/blob/master/images/jenkins_nodes.png)
Теперь, когда агент подключен, можно переходить к написанию скрипта.
#### Подготовка скрипта
Код скрипта доступен в разделе "Исходный код"
Для скрипта понадобилось создать параметры для Credentials гита и пароля для sudo
Далее представлены результаты работы скрипта
#### Результат
![](https://github.com/Criptonite/sopo/blob/master/images/jenkins_res.png)
![gif](https://github.com/Criptonite/sopo/blob/master/images/jenkins_pass_gif.gif)
#### Исходный код:
[Исходный код](https://github.com/Criptonite/sopo/blob/master/jenkins/Jenkinsfile)
