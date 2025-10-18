# Technical Design Document

## Architecture Overview

The serverless blog posting webapp will be built using AWS serverless technologies with a modern web frontend. The architecture follows a three-tier pattern with presentation, application, and data layers all implemented using managed AWS services.

## System Components

### Frontend Layer
- **Technology**: React.js single-page application
- **Hosting**: AWS S3 static website hosting with CloudFront CDN
- **Authentication**: AWS Cognito for user management (future enhancement)

### Application Layer
- **API Gateway**: RESTful API endpoints for blog operations
- **Lambda Functions**: Node.js runtime for business logic
  - `createBlogPost`: Handle blog post creation
  - `getBlogPosts`: Retrieve blog posts with pagination
  - `getBlogPost`: Retrieve single blog post by ID
  - `updateBlogPost`: Update existing blog post
  - `deleteBlogPost`: Delete blog post by ID

### Data Layer
- **Database**: Amazon DynamoDB (NoSQL)
- **Table Structure**:
  - Primary Key: `postId` (String)
  - Sort Key: Not required for this use case
  - Attributes: `title`, `content`, `author`, `tags`, `createdAt`, `updatedAt`, `status`

## API Design

### REST Endpoints
```
GET /posts - Retrieve all blog posts
GET /posts/{id} - Retrieve specific blog post
POST /posts - Create new blog post
PUT /posts/{id} - Update existing blog post
DELETE /posts/{id} - Delete blog post
```

### Data Models

#### Blog Post Model
```json
{
  "postId": "uuid-string",
  "title": "string",
  "content": "string",
  "author": "string",
  "tags": ["string"],
  "createdAt": "ISO-8601-timestamp",
  "updatedAt": "ISO-8601-timestamp",
  "status": "published|draft"
}
```

## Infrastructure as Code

### CDK Stack Components
- **DynamoDB Table**: Blog posts storage with on-demand billing
- **Lambda Functions**: Individual functions for each API operation
- **API Gateway**: REST API with Lambda proxy integration
- **S3 Bucket**: Static website hosting for frontend
- **CloudFront Distribution**: CDN for global content delivery
- **IAM Roles**: Least privilege access for Lambda functions

## Security Considerations

- API Gateway with throttling and request validation
- Lambda functions with minimal IAM permissions
- DynamoDB with encryption at rest
- HTTPS enforcement through CloudFront
- Input validation and sanitization in Lambda functions

## Performance Considerations

- DynamoDB on-demand scaling for variable workloads
- Lambda cold start optimization with minimal dependencies
- CloudFront caching for static assets and API responses
- Efficient DynamoDB query patterns using primary key access

## Deployment Strategy

- Single CDK stack deployment
- Environment-specific configuration through CDK context
- No CI/CD pipeline - direct CDK deployment
- Sample data initialization through Lambda function or CDK custom resource

## Database Schema

### DynamoDB Table: BlogPosts
- **Table Name**: `BlogPosts`
- **Primary Key**: `postId` (String)
- **Attributes**:
  - `postId`: Unique identifier (UUID)
  - `title`: Blog post title (String)
  - `content`: Blog post content (String)
  - `author`: Author name (String)
  - `tags`: Array of tags (StringSet)
  - `createdAt`: Creation timestamp (String, ISO-8601)
  - `updatedAt`: Last modification timestamp (String, ISO-8601)
  - `status`: Publication status (String: "published" | "draft")

### Access Patterns
1. Get all published posts (Scan with filter)
2. Get post by ID (GetItem)
3. Create new post (PutItem)
4. Update existing post (UpdateItem)
5. Delete post (DeleteItem)

## Error Handling

- Standardized error responses from API Gateway
- Lambda function error logging to CloudWatch
- Client-side error handling with user-friendly messages
- Validation errors returned with specific field information