# QR Code Integration for Event Attendance Validation with QR TIGER API

This guide provides a step-by-step process to integrate the QR TIGER Track Data API for generating and tracking QR codes to validate attendance at your event. It assumes you have an existing form on your website that collects participant data and generates a unique participant ID.

## Prerequisites
- **QR TIGER Account**: Sign up for a free account at https://www.qr-tiger.com.
- **API Key**: 
  - Log in to your QR TIGER account.
  - Go to **Dashboard > Settings > API** (or similar section).
  - Copy your API Key (e.g., `abc123xyz789`) and store it securely in your backend (e.g., environment variables).
- **Backend Setup**: Ensure your website has a server-side application (e.g., Node.js, PHP, Python) to make API calls.
- **Validation Endpoint**: Create an endpoint on your site (e.g., `https://yourwebsite.com/checkin?id=PARTICIPANT_ID`) to log attendance when a QR code is scanned.
- **Form Integration**: Your form should generate a unique participant ID for each submission, stored in your database with participant details (e.g., name, email).
- **Tools**: Use a QR code scanner (e.g., QR TIGER Scanner app or any generic reader) for event-day validation.

## Generating QR Codes
**Goal**: Generate a dynamic QR code for each participant after form submission, linking to a unique attendance validation URL.

### Steps
1. **Form Submission**:
   - After a participant submits the form, your backend generates a unique ID (e.g., `12345`) and stores their details in your database.
   - Create a unique URL for validation, e.g., `https://yourwebsite.com/checkin?id=12345`.

2. **API Call to Generate QR Code**:
   - Use the QR TIGER API to create a dynamic QR code.
   - **Endpoint**: `POST https://api.qr-tiger.com/api/campaign`
   - **Request Example** (using cURL, adapt to your language):
     ```bash
     curl -X POST https://api.qr-tiger.com/api/campaign \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
           "qr_type": "url",
           "data": "https://yourwebsite.com/checkin?id=12345"
         }'
     ```
     - Replace `YOUR_API_KEY` with your QR TIGER API Key.
     - `qr_type`: Set to `"url"`.
     - `data`: The participant’s unique validation URL.
   - **Response**:
     ```json
     {
       "qr_code_id": "123456",
       "qr_image_url": "https://qrtiger.com/qr/123456.png",
       "status": "success"
     }
     ```

3. **Store QR Code Data**:
   - Save `qr_code_id` and `qr_image_url` in your database, linked to the participant’s ID.
   - Download or store the QR code image for distribution.

4. **Distribute QR Code**:
   - Send the QR code to the participant via email (e.g., using SendGrid, PHPMailer) or display it on a confirmation page.
   - Example email:
     ```
     Subject: Your Event QR Code
     Dear [Participant Name],
     Thank you for registering for [Event Name]! Please present the attached QR code at the event for check-in.
     [Attach QR code image or include qr_image_url]
     ```

## Tracking Scans for Attendance Validation
**Goal**: Track QR code scans to confirm attendance during the event.

### Steps
1. **Set Up Validation Endpoint**:
   - Create an endpoint (e.g., `https://yourwebsite.com/checkin?id=12345`) that:
     - Receives the participant ID from the URL.
     - Updates the participant’s status to "attended" in your database.
     - Returns a confirmation (e.g., `{"status": "success", "message": "Attendance confirmed for ID 12345"}`).

2. **Scan QR Codes at the Event**:
   - Use a QR code scanner app (e.g., QR TIGER Scanner or any generic reader).
   - Scanning the QR code redirects to the validation URL, triggering the attendance update.

3. **Track Scan Data via API**:
   - Use the Track Data API to retrieve scan statistics.
   - **Endpoint**: `GET https://api.qr-tiger.com/api/track/{qr_code_id}`
   - **Request Example**:
     ```bash
     curl -X GET https://api.qr-tiger.com/api/track/123456 \
     -H "Authorization: Bearer YOUR_API_KEY"
     ```
     - Replace `123456` with the `qr_code_id` from the generation response.
   - **Response**:
     ```json
     {
       "qr_code_id": "123456",
       "total_scans": 1,
       "scan_data": [
         {
           "timestamp": 1639375248,
           "location": "Sao Paulo, BR"
         }
       ]
     }
     ```

4. **Optional: Filter Scans by Date**:
   - To retrieve scans for a specific day, add a `timestamp` parameter (epoch format, e.g., `1639375248` for 12/13/2021 6:00:48).
     ```bash
     curl -X GET https://api.qr-tiger.com/api/track/123456?timestamp=1639375248 \
     -H "Authorization: Bearer YOUR_API_KEY"
     ```
   - For a specific month, use `timestamp` and `endTimestamp` (e.g., September 2020: `?timestamp=1598918400&endTimestamp=1601510399`).

## Monitoring and Reporting
**Goal**: Generate attendance reports based on QR code scans.

### Steps
1. **Retrieve Scan Data**:
   - Use the Track Data API to get all scans for a QR code.
   - Parse `scan_data` to count unique scans and confirm attendance.

2. **Integrate with Your System**:
   - Sync scan data with your database to mark participants as attended.
   - Generate reports (e.g., total attendees, no-shows) by comparing scanned IDs with registered IDs.

## Example Implementation (Node.js)
```javascript
const axios = require('axios');

const API_KEY = 'YOUR_API_KEY'; // Replace with your QR TIGER API Key
const BASE_URL = 'https://api.qr-tiger.com/api';

// Generate QR Code
async function generateQRCode(participantId) {
  try {
    const response = await axios.post(
      `${BASE_URL}/campaign`,
      {
        qr_type: 'url',
        data: `https://yourwebsite.com/checkin?id=${participantId}`,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.qr_image_url;
  } catch (error) {
    console.error('Error generating QR code:', error.response.data);
    throw error;
  }
}

// Track QR Code Scans
async function trackQRCode(qrCodeId) {
  try {
    const response = await axios.get(`${BASE_URL}/track/${qrCodeId}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error tracking QR code:', error.response.data);
    throw error;
  }
}

// Example Usage
(async () => {
  const participantId = '12345';
  const qrImageUrl = await generateQRCode(participantId);
  console.log('QR Code URL:', qrImageUrl);

  const qrCodeId = '123456'; // From generateQRCode response
  const scanData = await trackQRCode(qrCodeId);
  console.log('Scan Data:', scanData);
})();
```

## Testing and Validation
- **QR Code Generation**:
  - Submit a test form entry and verify the QR code links to the correct URL.
  - Scan the QR code to ensure it redirects to your validation endpoint.
- **Attendance Tracking**:
  - Simulate scans and verify that your system logs attendance.
  - Use the Track Data API to confirm scan data matches your records.
- **Edge Cases**:
  - Test invalid participant IDs to ensure error handling.
  - Test multiple scans of the same QR code to prevent duplicates (if required).

## Limitations (Free Plan)
- Up to 3 dynamic QR codes and 500 scans per code.
- Limited customization (e.g., no logos in free plan).
- API rate limits may apply (check documentation).

## Security
- Store the API Key securely (e.g., in environment variables).
- Protect your validation endpoint against unauthorized access (e.g., rate limiting).
- Avoid exposing QR code URLs publicly to prevent misuse.

## Documentation
- Full API details: https://qrtiger.stoplight.io/docs/qrtiger-api/d999deb6783a3-guide-to-track-data-api
- Contact QR TIGER support via https://www.qr-tiger.com for assistance.

## Next Steps
1. Obtain your API Key from QR TIGER (Dashboard > Settings > API).
2. Implement QR code generation in your backend.
3. Set up the validation endpoint to log attendance.
4. Test the flow: form submission → QR code generation → email → scan → validation.
5. Monitor attendance with the Track Data API.