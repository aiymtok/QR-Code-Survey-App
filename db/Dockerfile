FROM amazonlinux:2

RUN yum update -y && \
    yum install -y mariadb-server && \
    yum clean all

COPY init.sql /docker-entrypoint-init.sql

CMD ["sh", "-c", "\
mysqld_safe & \
echo '⏳ Waiting for MariaDB to be ready...'; \
until mysqladmin ping --silent; do sleep 1; done; \
echo '✅ MariaDB ready. Executing init.sql...'; \
mysql -u root < /docker-entrypoint-init.sql; \
tail -f /dev/null"]
