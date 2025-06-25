FROM amazonlinux:2

RUN yum -y update && \
    yum -y install mariadb-server hostname passwd psmisc && \
    yum clean all

COPY init.sql /init.sql

EXPOSE 3306

CMD ["/bin/bash", "-c", "\
  if [ ! -d /var/lib/mysql/mysql ]; then \
    mysql_install_db --user=root --ldata=/var/lib/mysql && \
    /usr/libexec/mysqld --datadir=/var/lib/mysql --user=root --skip-networking & \
    sleep 5 && \
    mysql -u root < /init.sql && \
    killall mysqld; \
  fi && \
  exec /usr/libexec/mysqld --datadir=/var/lib/mysql --user=root \
"]
