resource "aws_elastic_beanstalk_application" "app" {
  name = var.app_name

  tags = {
    Name      = "${var.app_name}"
    ManagedBy = "terraform"
  }
}

resource "aws_elastic_beanstalk_environment" "staging" {
  name                = var.beanstalk_environment
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = "64bit Amazon Linux 2 v3.6.1 running Docker"

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = var.vpc_id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", var.vpc_private_subnet_ids)
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBSubnets"
    value     = join(",", var.vpc_public_subnet_ids)
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBScheme"
    value     = "public"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.elasticbeanstalk_ec2.name
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.micro"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = var.app_security_group_id
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "API_HOST"
    value     = var.api_host
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "API_PORT"
    value     = var.api_port
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "CLIENT_HOST"
    value     = var.client_host
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "CLIENT_PORT"
    value     = var.client_port
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "NGINX_HOST"
    value     = var.nginx_host
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "NGINX_PORT"
    value     = var.nginx_port
  }

  tags = {
    ManagedBy = "terraform"
  }
}