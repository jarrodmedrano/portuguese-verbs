data "aws_iam_policy_document" "elasticbeanstalk_ec2_trust" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "elasticbeanstalk_ec2" {
  name               = "${var.app_name}-${var.environment}-beanstalk-ec2-role"
  assume_role_policy = data.aws_iam_policy_document.elasticbeanstalk_ec2_trust.json

  tags = {
    Name      = "${var.app_name}-${var.environment}-beanstalk-ec2-role"
    ManagedBy = "terraform"
  }
}

resource "aws_iam_instance_profile" "elasticbeanstalk_ec2" {
  name = "${var.app_name}-${var.environment}-beanstalk-ec2-instance-profile"
  role = aws_iam_role.elasticbeanstalk_ec2.name
}

data "aws_iam_policy_document" "elasticbeanstalk_ec2" {
  statement {
    sid = "BucketAccess"

    actions = [
      "s3:Get*",
      "s3:List*",
      "s3:PutObject",
    ]

    resources = [
      "arn:aws:s3:::elasticbeanstalk-*",
      "arn:aws:s3:::elasticbeanstalk-*/*"
    ]
  }

  statement {
    sid = "CloudWatchLogsAccess"

    actions = [
      "logs:PutLogEvents",
      "logs:CreateLogStream",
      "logs:DescribeLogStreams",
      "logs:DescribeLogGroups",
    ]

    resources = [
      "arn:aws:logs:*:*:log-group:/aws/elasticbeanstalk*"
    ]
  }

  statement {
    sid = "ElasticBeanstalkHealthAccess"

    actions = [
      "elasticbeanstalk:PutInstanceStatistics",
    ]

    resources = [
      "arn:aws:elasticbeanstalk:*:*:application/*",
      "arn:aws:elasticbeanstalk:*:*:environment/*",
    ]
  }

  statement {
    sid = "AmazonEC2ContainerRegistryReadOnly"

    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:GetRepositoryPolicy",
      "ecr:DescribeRepositories",
      "ecr:ListImages",
      "ecr:DescribeImages",
      "ecr:BatchGetImage",
      "ecr:GetLifecyclePolicy",
      "ecr:GetLifecyclePolicyPreview",
      "ecr:ListTagsForResource",
      "ecr:DescribeImageScanFindings",
    ]

    resources = [
      "*",
    ]
  }
}

resource "aws_iam_role_policy" "elasticbeanstalk_ec2" {
  name   = "${var.app_name}-${var.environment}-elasticbeanstalk-ec2-role-policy"
  role   = aws_iam_role.elasticbeanstalk_ec2.id
  policy = data.aws_iam_policy_document.elasticbeanstalk_ec2.json
}
