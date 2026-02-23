const sellerViewEmail = (data) =>
  `  <html>
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
          
          <p>We’re pleased to inform you that a verified buyer/investor has shown interest in your business listing on <strong>ProfitableBusinessesForSale.com</strong> and has viewed your contact details (Email and Number).</p>

        <h3>Listing Details:</h3>
        <p>
            <strong>Business Name:</strong> ${data.businessName}
        </p>

        ${
            data.sellerSubscriptionPlanPrice > 0 ?

                `<h3>Buyer Information :</h3>
                <p>
                    <strong>Buyer Name:</strong> ${data.buyerName}<br>
                    <strong>Buyer Email:</strong> ${data.buyerEmail}<br>
                    <strong>Buyer Mobile:</strong> ${data.buyerMobile}}
                </p>` : `<p>To view the buyer's contact details, please upgrade to our premium subscription plan. <a href="https://profitablebusinessesforsale.com/pricing">Click here to upgrade now.</a></p>`
        }


        <p>
            The buyer may contact you directly using the details provided in your listing and profile.
        </p>
          
          <p> <a href="https://profitablebusinessesforsale.com/">Log In</a> now to explore this opportunity and connect with the Buyer/Investor.</p>
          <p><a href="https://profitablebusinessesforsale.com/">View Business</a></p>
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

export default sellerViewEmail;

// <-- <a href="https://profitablebusinessesforsale.com/"><img src="uploads/logo/pbfs-logo.png" alt="PBFS" class="logo-img"/></a> -->