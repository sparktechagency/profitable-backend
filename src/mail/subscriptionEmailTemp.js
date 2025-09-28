const subscriptionEmailTemp = (data) =>
  ` 
     <html>
      <head>
        <style>
          body {
            font-family: 'Verdana', 'Arial', sans-serif;        
            font-family: Arial, sans-serif;
            background-color: #f2f3f8;
            margin: 0;
            padding: 0;
          }
          .container {
            font-family: 'Verdana', 'Arial', sans-serif;        
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #022C22;
            font-size: 26px;
            margin-bottom: 20px;
            font-weight: bold;
            text-align: center;
          }
          p {
            color: #555555;
            line-height: 1.8;
            font-size: 16px;
            margin-bottom: 20px;
          }
          .logo {
            text-align: center;
          }
          .logo-img {
            max-width: 20%;

          }
          .code {
            text-align: center;
            background-color: #e8f0fe;
            padding: 14px 24px;
            font-size: 20px;
            font-weight: bold;
            color: #022C22;
            border-radius: 6px;
            letter-spacing: 2px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            font-size: 13px;
            color: #9e9e9e;
            text-align: center;
          }
          .footer p {
            margin: 5px 0;
          }
          a {
            color: #022C22;
            text-decoration: none;
          }
        </style>
      </head>

      <body>
        <div class="container">
          
          <p>Hello, ${data.name}</p>
          <p>Thank you for subscribing to ProfitableBusinessesForSale.com! <br> 
            Your subscription plan has been successfully activated. </p>
          <h3>Plan : ${data.subscriptionPlan}</h3>
          <h3>Price : $ ${data.price}</h3>

          <h3>Start Date: ${data.startDate}</h3>
          <h3>End Date: ${data.endDate}</h3>
          <p>You can now enjoy full access to premium features.</p>
          <p>Go to <a href="https://profitablebusinessesforsale.com/">Dashboard</a></p>
          <p>Best Regards,<br>Team PBFS</p>
        </div>
        <div class="footer">
          <a href="https://profitablebusinessesforsale.com/"><img src="https://pbfsimage.s3.eu-north-1.amazonaws.com/Pbfs_logo.png" class="logo-img"/></a>
        <p> <a href="https://profitablebusinessesforsale.com/">ProfitableBusinessesForSale.com</a> | <a href="info@ProfitableBusinessesForSale.com">info@ProfitableBusinessesForSale.com</a>.</p>
          <p> Follow Us on 
            <a href="https://www.facebook.com/share/1J7PbBaf1G/?mibextid=wwXIfr">Facebook</a> |

            <a href="https://www.instagram.com/profitablebusinessesforsale?igsh=MTc5bTVrcWJoZHNtbQ%3D%3D&utm_source=…">Instagram</a>
          </p>
        </div>
      </body>
    </html>
  `;

export default subscriptionEmailTemp;

// /<-- <a href="https://profitablebusinessesforsale.com/"><img src="uploads/logo/pbfs-logo.png" alt="PBFS" class="logo-img"/></a> -->
