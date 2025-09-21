## AI Threat Dashboard (React + Vite)

Full documentation here (temporary file because original README.md patching failed):

### Quick Start
```powershell
npm install
npm run dev
```

### API Data Source
Default base URL fallback:
```
https://31d6klljg0.execute-api.us-east-1.amazonaws.com/dev
```
Request: `GET <base>/getData?ts=<timestamp>`

Override via `.env`:
```
VITE_API_BASE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
```

### Expected JSON
```json
{
  "summary": {"summary":"...","common_patterns":["..."],"key_findings":["..."],"total_logs":0,"normal_logs":0,"abnormal_logs":0},
  "logs": [{"log_id":"abc","category":"normal","hypotheses":["..."],"investigation_log":"..."}],
  "metrics": [{"time":"10:00","anomalies":2,"logs":40}]
}
```

### CORS
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Troubleshooting
HTTP 403/401 -> Auth; CORS errors -> enable CORS; Empty charts -> ensure metrics array; No summary -> provide summary object.

### Polling Example
```js
const interval = setInterval(fetchLatest, 60000);
return () => clearInterval(interval);
```
