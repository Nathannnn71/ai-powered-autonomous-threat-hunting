// AWS Lambda Function for AI Threat Dashboard API
// This will serve your threat data from S3

import AWS from 'aws-sdk';

const s3 = new AWS.S3({ region: 'us-east-1' });

export const handler = async (event, context) => {
    console.log('🔍 Lambda function triggered:', event.path);
    
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
    
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    try {
        // Route handling
        const path = event.path || event.rawPath;
        
        if (path === '/api/health' || path === '/health') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    status: 'healthy',
                    timestamp: new Date().toISOString(),
                    service: 'AWS Lambda',
                    buckets: {
                        raw: 'wazuh-raw',
                        results: 'wazuh-results'
                    }
                })
            };
        }
        
        if (path === '/api/getData' || path === '/getData') {
            console.log('📊 Fetching threat data from S3...');
            
            try {
                // Try to get real data from S3
                const params = {
                    Bucket: 'wazuh-results',
                    Key: 'latest_analysis.json'
                };
                
                const data = await s3.getObject(params).promise();
                const threatData = JSON.parse(data.Body.toString());
                
                // Add timestamp
                threatData.timestamp = new Date().toISOString();
                threatData.source = 'S3';
                
                console.log('✅ Real data retrieved from S3');
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(threatData)
                };
                
            } catch (s3Error) {
                console.log('⚠️ S3 data not available, using fallback:', s3Error.message);
                
                // Fallback data
                const fallbackData = {
                    summary: {
                        summary: "AI Threat Dashboard - Lambda Serverless Version Active! Wazuh data pipeline connecting...",
                        common_patterns: [
                            "Failed login attempts",
                            "Suspicious network activity", 
                            "File integrity monitoring alerts"
                        ],
                        key_findings: [
                            "System running on AWS Lambda",
                            "S3 buckets configured",
                            "Real-time monitoring ready"
                        ],
                        total_logs: 156,
                        normal_logs: 142,
                        abnormal_logs: 14
                    },
                    logs: [
                        {
                            log_id: "lambda_001",
                            category: "normal",
                            hypotheses: ["System initialization"],
                            investigation_log: "Lambda function deployed successfully"
                        },
                        {
                            log_id: "lambda_002", 
                            category: "abnormal",
                            hypotheses: ["Monitoring configuration pending"],
                            investigation_log: "Wazuh integration in progress"
                        }
                    ],
                    metrics: [
                        {
                            time: new Date().toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: false 
                            }),
                            anomalies: 14,
                            logs: 156
                        }
                    ],
                    timestamp: new Date().toISOString(),
                    source: 'Fallback'
                };
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(fallbackData)
                };
            }
        }
        
        // Default response for unknown paths
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
                error: 'Not found',
                available_endpoints: ['/api/health', '/api/getData']
            })
        };
        
    } catch (error) {
        console.error('❌ Lambda error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};