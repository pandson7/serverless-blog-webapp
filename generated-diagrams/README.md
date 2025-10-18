# AWS Architecture Diagrams for Serverless Blog Posting Webapp

This directory contains AWS architecture diagrams generated for the serverless blog posting webapp based on the technical design specification.

## Generated Diagrams

### 1. Serverless Blog Architecture (`serverless-blog-architecture.png`)
**Purpose**: High-level overview of the serverless architecture
**Components**:
- **Frontend Layer**: React SPA hosted on S3 with CloudFront CDN
- **Application Layer**: API Gateway with 5 Lambda functions for CRUD operations
- **Data Layer**: DynamoDB table for blog post storage

**Key Features**:
- Fully serverless architecture
- Scalable and cost-effective
- Global content delivery via CloudFront

### 2. Blog API Flow (`blog-api-flow.png`)
**Purpose**: Detailed view of API endpoints and data flow
**Components**:
- Specific Lambda functions for each API operation:
  - `POST /posts` - Create blog post
  - `GET /posts` - List all posts
  - `GET /posts/{id}` - Get single post
  - `PUT /posts/{id}` - Update post
  - `DELETE /posts/{id}` - Delete post
- DynamoDB table with postId as primary key

**Key Features**:
- RESTful API design
- Clear separation of concerns
- Direct Lambda-DynamoDB integration

### 3. Deployment Architecture (`blog-deployment-architecture.png`)
**Purpose**: Infrastructure and deployment view
**Components**:
- **Content Delivery**: CloudFront + S3 for static assets
- **API & Compute**: API Gateway + Lambda functions
- **Database**: DynamoDB for data persistence
- **Security & Monitoring**: IAM roles and CloudWatch integration

**Key Features**:
- Security through IAM roles
- Monitoring and logging with CloudWatch
- Global distribution capabilities

## Architecture Benefits

1. **Serverless**: No server management, automatic scaling
2. **Cost-Effective**: Pay-per-use pricing model
3. **High Availability**: Built-in redundancy across AWS regions
4. **Security**: IAM-based access control and HTTPS enforcement
5. **Performance**: CloudFront CDN for global content delivery
6. **Maintainability**: Clear separation of concerns and microservices pattern

## Technical Implementation

The architecture follows AWS Well-Architected Framework principles:
- **Operational Excellence**: CloudWatch monitoring and logging
- **Security**: IAM roles with least privilege access
- **Reliability**: Serverless services with built-in fault tolerance
- **Performance Efficiency**: On-demand scaling and CDN caching
- **Cost Optimization**: Pay-per-use serverless pricing model

## Next Steps

These diagrams can be used for:
1. Development team onboarding
2. Infrastructure planning and provisioning
3. Security review and compliance
4. Performance optimization planning
5. Documentation and knowledge sharing