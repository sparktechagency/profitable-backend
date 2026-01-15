const adminNdaEmailTemp = (data) =>
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
          
          <p>Hello, Admin</p>
          <p>An user submit a NDA agreement. Please check it out.</p>

          <h5> Here are the user details: </h5>
          
          <h3>User Name: ${data.name}</h3>
          <h3>User Email: ${data.email}</h3>
          <h3>User Contact: ${data.phone}</h3>
          <h3>User Role: ${data.role}</h3>

          <p>Please log in to your Dashboard to see the agreement.</p>
          <p>Login to <a href="https://admin.profitablebusinessesforsale.com/">PBFS Dashboard</a></p>
          <p>Best Regards,<br>Team PBFS</p>

        </div>
        <div class="footer">
        <a href="https://profitablebusinessesforsale.com/"><img src="https://pbfs-logo-2025.s3.ap-south-1.amazonaws.com/Pbfs_logo.png" class="logo-img"/></a>
        <p> <a href="https://profitablebusinessesforsale.com/">ProfitableBusinessesForSale.com</a> | <a href="info@ProfitableBusinessesForSale.com">info@ProfitableBusinessesForSale.com</a>.</p>
          <p> Follow Us on 
            <a href="https://www.facebook.com/share/1J7PbBaf1G/?mibextid=wwXIfr">Facebook</a> |
            <a href="https://www.instagram.com/profitablebusinessesforsale?igsh=MTc5bTVrcWJoZHNtbQ%3D%3D&utm_source=…">Instagram</a>
          </p>
        </div>
      </body>
    </html>
  `;

export default adminNdaEmailTemp;

// /<-- <a href="https://profitablebusinessesforsale.com/"><img src="uploads/logo/pbfs-logo.png" alt="PBFS" class="logo-img"/></a> -->
