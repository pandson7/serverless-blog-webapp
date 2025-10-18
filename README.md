# Serverless Blog Posting Web Application

A complete serverless blog posting web application built with AWS CDK, featuring a React frontend, API Gateway, Lambda functions, and DynamoDB storage.

## 🏗️ Architecture

This application implements a modern serverless architecture using AWS services:

- **Frontend**: React TypeScript application (planned)
- **API**: AWS API Gateway with Lambda integration
- **Database**: DynamoDB for blog post storage
- **Infrastructure**: AWS CDK for Infrastructure as Code
- **Authentication**: Planned integration with AWS Cognito

## 📁 Project Structure

```
├── specs/                          # Project specifications and requirements
│   ├── requirements.md             # Functional and non-functional requirements
│   ├── design.md                   # System design and architecture
│   └── tasks.md                    # Development tasks breakdown
├── cdk-app/                        # AWS CDK infrastructure code
│   ├── lib/                        # CDK stack definitions
│   ├── bin/                        # CDK app entry point
│   ├── test/                       # Infrastructure tests
│   └── package.json                # Node.js dependencies
├── generated-diagrams/             # Architecture diagrams
│   ├── serverless-blog-architecture.png
│   ├── blog-api-flow.png
│   ├── blog-deployment-architecture.png
│   └── README.md                   # Diagram descriptions
├── pricing/                        # Cost analysis
│   └── cost_analysis_report.md     # Detailed cost breakdown
├── tasks/                          # Task management files
└── jira_user_stories_summary.md    # User stories and acceptance criteria
```

## 🚀 Deployed Infrastructure

**Stack Name**: BlogPostingWebappStack-101720252116
**Region**: us-east-1
**API Endpoint**: https://jqwf3ujadh.execute-api.us-east-1.amazonaws.com/prod

### AWS Resources

- **API Gateway**: RESTful API with CORS enabled
- **Lambda Functions**: 
  - Create Blog Post
  - Get Blog Posts
  - Get Single Blog Post
  - Update Blog Post
  - Delete Blog Post
- **DynamoDB Table**: BlogPosts-101720252116
- **IAM Roles**: Least privilege access for Lambda functions

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS CLI configured with appropriate permissions
- AWS CDK CLI installed (`npm install -g aws-cdk`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pandson7/serverless-blog-webapp.git
cd serverless-blog-webapp
```

2. Install CDK dependencies:
```bash
cd cdk-app
npm install
```

3. Deploy the infrastructure:
```bash
cdk deploy
```

## 📊 API Endpoints

Base URL: `https://jqwf3ujadh.execute-api.us-east-1.amazonaws.com/prod`

- `GET /posts` - Retrieve all blog posts
- `GET /posts/{id}` - Retrieve a specific blog post
- `POST /posts` - Create a new blog post
- `PUT /posts/{id}` - Update an existing blog post
- `DELETE /posts/{id}` - Delete a blog post

## 💰 Cost Analysis

The application is designed for cost-effectiveness with serverless architecture:

- **Estimated Monthly Cost**: $5-50 depending on usage
- **Pay-per-use model**: Only pay for actual requests and storage
- **Auto-scaling**: Handles traffic spikes without manual intervention

See [pricing/cost_analysis_report.md](pricing/cost_analysis_report.md) for detailed cost breakdown.

## 📋 User Stories

The application supports the following user stories:

1. **Create Blog Posts**: Users can create new blog posts with title and content
2. **View Blog Posts**: Users can view all published blog posts
3. **Edit Blog Posts**: Users can update existing blog posts
4. **Delete Blog Posts**: Users can remove blog posts
5. **Responsive Design**: Application works on desktop and mobile devices

See [jira_user_stories_summary.md](jira_user_stories_summary.md) for complete user stories with acceptance criteria.

## 🧪 Testing

Run the CDK tests:
```bash
cd cdk-app
npm test
```

## 📈 Monitoring and Observability

- CloudWatch Logs for Lambda function monitoring
- API Gateway access logs
- DynamoDB metrics
- X-Ray tracing (can be enabled)

## 🔒 Security Features

- CORS configuration for secure cross-origin requests
- IAM roles with least privilege access
- Input validation in Lambda functions
- HTTPS-only API endpoints

## 🚧 Future Enhancements

- React frontend implementation
- User authentication with AWS Cognito
- Image upload functionality with S3
- Search functionality with OpenSearch
- Content moderation
- Email notifications
- Admin dashboard

## 📝 Documentation

- [Requirements](specs/requirements.md) - Detailed functional requirements
- [System Design](specs/design.md) - Architecture and design decisions
- [Architecture Diagrams](generated-diagrams/README.md) - Visual system overview
- [Cost Analysis](pricing/cost_analysis_report.md) - Pricing breakdown

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues, please create an issue in the GitHub repository.