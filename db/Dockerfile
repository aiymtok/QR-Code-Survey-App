FROM amazonlinux:2

RUN yum -y update && \
    yum -y install mariadb-server hostname passwd && \
    yum clean all

EXPOSE 3306

CMD ["/bin/bash", "-c", "\
  if [ ! -d /var/lib/mysql/mysql ]; then mysql_install_db --user=root --ldata=/var/lib/mysql; fi && \
  exec /usr/libexec/mysqld --datadir=/var/lib/mysql --user=root \
"]
