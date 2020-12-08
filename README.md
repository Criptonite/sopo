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
#### Скрипт для сборки образа

#### Сборка

#### Результат:
***
# gitlab
***
# jenkins
