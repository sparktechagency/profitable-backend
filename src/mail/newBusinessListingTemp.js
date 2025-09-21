const newBusinessListing = (data) =>
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
          <p>A new business opportunity has just been listed on ProfitableBusinessesForSale.com that may interest you. </p>
          <h3>Business: ${data.title}</h3>
          <h3>Location: ${data.country}</h3>
          <h3>Type: ${data.businessType}</h3>
          
          <p> <a href="https://profitablebusinessesforsale.com/">Log In</a> now to explore this opportunity and connect with the seller.</p>
          <p><a href="https://profitablebusinessesforsale.com/">View Business</a></p>
          <p>Best Regards,<br>Team PBFS</p>
        </div>
        <div class="footer">
          
          <p> <a href="https://profitablebusinessesforsale.com/">ProfitableBusinessesForSale.com</a> | <a href="info@ProfitableBusinessesForSale.com">info@ProfitableBusinessesForSale.com</a>.</p>
          <p> Follow Us on 
            <a href="https://www.facebook.com/share/1J7PbBaf1G/?mibextid=wwXIfr">Facebook</a> |

            <a href="https://www.instagram.com/profitablebusinessesforsale?igsh=MTc5bTVrcWJoZHNtbQ%3D%3D&utm_source=…">Instagram</a>
          </p>
        </div>
      </body>
    </html>
  `;

export default newBusinessListing;

// <-- <a href="https://profitablebusinessesforsale.com/"><img src="uploads/logo/pbfs-logo.png" alt="PBFS" class="logo-img"/></a> -->