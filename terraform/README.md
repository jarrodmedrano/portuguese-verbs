# Terraform Learning

This repo is for learning terraform with AWS

### Helpful Commands

`terraform show`

Shows terraform state

`terraform show | grep -A 20 aws_vpc`

Show 20 lines after matching aws_vpc

`terraform state list`

lists all the resources in state

`terraform state show aws_instance.my_vm`

shows all attributes of a resource

`-replace`

safely recreates resources without destroying

Used when system malfunctions

`terraform plan -replace="aws_instance.my_vm"`

Will replace this one resource if you apply it.

`terraform apply -replace="aws_instance.my_vm"`

`terraform init` `terraform console` opens terraform console

type `local.common-tags` to console log the variable

Reconfigure state

`terraform init -reconfigure -backend-config=backend.conf`

Migrating state

`terraform init -migrate-state`

## adding permissions on the bucket

````{
    "Version": "2012-10-17",
    "Id": "Policy1687529715956",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::192147673460:root"
            },
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::work-tf-remote-state"
        },
        {
            "Sid": "Stmt1687529708427",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::192147673460:root"
            },
            "Action": [
                "s3:DeleteObject",
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::work-tf-remote-state/s3_backend.tfstate"
        }
    ]
}```
````
