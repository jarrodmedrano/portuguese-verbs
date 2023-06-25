#!/bin/bash
sudo yum -y update && sudo yum -y install httpd
sudo systemctl start httpd && sudo systemctl enable httpd
sudo echo "Hello World from $(hostname -f)" > /var/www/html/index.html

sudo yum -y install docker
sudo systemctl start docker && sudo systemctl enable docker
sudo usermod -aG docker ec2-user
sudo docker run -p 80:80 nginx
```