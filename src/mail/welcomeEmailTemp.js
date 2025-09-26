const welcomeEmailTemp = (data) =>
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
          <p>Welcome to ProfitableBusinessesForSale.com (PBFS) - where opportunities meet legacy. </p>
          <h5> Here’s how you can get started: </h5>
          <p>✔ Complete your profile for better visibility <br>
            ✔ Sellers - List your business, franchise, or assets <br>
            ✔ Buyers/Investors - Browse opportunities worldwide <br>
            ✔ Brokers & Franchisors - Maximize your reach with tailored packages 
          </p>
          <p> <a href="https://profitablebusinessesforsale.com/">Log In</a> and get started</p>
          <p>We’re excited to have you on board! For urgent support, you may contact us at info@ProfitableBusinessesForSale.com or through Live chat on website.</p>
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

export default welcomeEmailTemp;

// /<-- <a href="https://profitablebusinessesforsale.com/"><img src="uploads/logo/pbfs-logo.png" alt="PBFS" class="logo-img"/></a> -->
