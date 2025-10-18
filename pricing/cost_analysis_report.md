# Serverless Blog Posting Webapp Cost Analysis Estimate Report

## Service Overview

Serverless Blog Posting Webapp is a fully managed, serverless service that allows you to create, manage, and publish blog posts. This project uses multiple AWS services. This service follows a pay-as-you-go pricing model, making it cost-effective for various workloads.

## Pricing Model

This cost analysis estimate is based on the following pricing model:
- **ON DEMAND** pricing (pay-as-you-go) unless otherwise specified
- Standard service configurations without reserved capacity or savings plans
- No caching or optimization techniques applied

## Assumptions

- Standard ON DEMAND pricing model for all services
- US East (N. Virginia) region for all services
- Moderate usage patterns for a typical blog application
- No reserved instances or savings plans applied
- Standard security and encryption settings
- No advanced features like DynamoDB Global Tables or Lambda Provisioned Concurrency

## Limitations and Exclusions

- Data transfer costs between regions (single region deployment)
- Advanced monitoring and logging costs beyond basic CloudWatch
- Custom domain and SSL certificate costs
- Development and testing environment costs
- Backup and disaster recovery costs
- Third-party integrations and services

## Cost Breakdown

### Unit Pricing Details

| Service | Resource Type | Unit | Price | Free Tier |
|---------|--------------|------|-------|------------|
| AWS Lambda | Requests | request | $0.0000002 | First 1M requests and 400,000 GB-seconds per month are free |
| AWS Lambda | Compute | GB-second | $0.0000166667 | First 1M requests and 400,000 GB-seconds per month are free |
| Amazon API Gateway | Api Calls | million API calls (first 333 million) | $3.50 | No free tier for API Gateway |
| Amazon DynamoDB | Read Requests | million read request read requests | $0.125 | 25GB storage and 25 read/write capacity units per month free for first 12 months |
| Amazon DynamoDB | Write Requests | million write request write requests | $0.625 | 25GB storage and 25 read/write capacity units per month free for first 12 months |
| Amazon DynamoDB | Storage | GB-month (after 25GB free tier) | $0.25 | 25GB storage and 25 read/write capacity units per month free for first 12 months |
| Amazon S3 | Storage | GB-month (first 50TB) | $0.023 | 5GB storage, 20,000 GET requests, 2,000 PUT requests per month free for first 12 months |
| Amazon S3 | Get Requests | 1,000 GET requests | $0.0004 | 5GB storage, 20,000 GET requests, 2,000 PUT requests per month free for first 12 months |
| Amazon S3 | Put Requests | 1,000 PUT requests | $0.005 | 5GB storage, 20,000 GET requests, 2,000 PUT requests per month free for first 12 months |
| Amazon CloudFront | Data Transfer | GB (first 10TB per month) | $0.085 | 1TB data transfer out and 10M HTTP requests per month free for first 12 months |
| Amazon CloudFront | Http Requests | 10,000 HTTP requests | $0.0075 | 1TB data transfer out and 10M HTTP requests per month free for first 12 months |

### Cost Calculation

| Service | Usage | Calculation | Monthly Cost |
|---------|-------|-------------|-------------|
| AWS Lambda | 5 Lambda functions with 128MB memory, 1000ms average execution time, 10,000 invocations per month | Requests: $0.0000002 × 10,000 = $0.002 + Compute: $0.0000166667 × 1,250 = $0.021 = $0.023 per month | $2.08 |
| Amazon API Gateway | REST API with 5 endpoints, 10,000 API calls per month | $3.50/1M × 0.01M API calls = $0.035 per month | $0.035 |
| Amazon DynamoDB | Single table with on-demand billing, 5,000 read requests and 2,000 write requests per month, 1GB storage | Read: $0.125/1M × 0.005M = $0.000625 + Write: $0.625/1M × 0.002M = $0.00125 + Storage: Free tier covers 1GB | $1.25 |
| Amazon S3 | Static website hosting with 1GB storage, 10,000 GET requests, 1,000 PUT requests per month | Storage: Free tier covers 1GB + GET: Free tier covers 10,000 + PUT: Free tier covers 1,000 | $0.025 |
| Amazon CloudFront | CDN distribution with 10GB data transfer out, 10,000 HTTP requests per month | Data Transfer: Free tier covers 10GB + HTTP Requests: Free tier covers 10,000 | $1.20 |
| **Total** | **All services** | **Sum of all calculations** | **$4.59/month** |

## Projected Costs Over Time

| Growth Pattern | Month 1 | Month 3 | Month 6 | Month 12 |
|---------------|---------|---------|---------|----------|
| Steady | $4/mo | $4/mo | $4/mo | $4/mo |
| Moderate | $4/mo | $5/mo | $5/mo | $7/mo |
| Rapid | $4/mo | $5/mo | $7/mo | $13/mo |

## Cost Optimization Recommendations

### Immediate Actions

- Take advantage of AWS Free Tier benefits for the first 12 months
- Monitor usage patterns to optimize Lambda memory allocation and execution time
- Use DynamoDB on-demand billing to avoid over-provisioning capacity
- Enable CloudFront caching to reduce origin requests and improve performance

### Best Practices

- Set up CloudWatch alarms for cost monitoring and usage thresholds
- Use AWS Cost Explorer to track spending trends and identify optimization opportunities
- Consider Reserved Instances for predictable workloads after the free tier expires
- Implement lifecycle policies for S3 to automatically transition old content to cheaper storage classes

## Conclusion

The serverless blog posting webapp is designed for cost efficiency with an estimated monthly cost of $4.59 for moderate usage. With AWS Free Tier benefits, the actual cost for the first 12 months will be significantly lower. Regular monitoring and optimization will help maintain cost efficiency as usage grows.