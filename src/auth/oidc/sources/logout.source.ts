export const logoutSource = async (ctx: any, form: any) => {
  ctx.body = `
  <html>
    <head>
      <title>Deseja sair?</title>
      <link href="https://fonts.googleapis.com/css2?family=Syne&amp;display=swap" rel="stylesheet">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          font-family: 'Syne';
        }

        body {
          width: 100vw;
          height: 100vh;
          background: #f8f9fc;
          padding: 0;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        button {
          border: 0px;
          height: 46px;
          padding: 0 16px;
          border-radius: 30px;
          font-weight: 500;
          font-size: 16px;
          cursor: pointer;
          width: 100%;
        }

        .container-content {
          background: #fff;
          width: 320px;
          margin: 0 auto;
          padding: 0px 24px;
          border: 1px #efefef solid;
          padding-bottom: 24px;
          border-radius: 5px;
          margin-top: 32px;
          text-align: center;
        }

        h1 {
          font-weight: 700;
          text-align: center;
        }

        .yes {
          background: #B6EBFF;
          color: #003543;
          margin-bottom: 16px;
        }

        .no {
          background: #fff;
          border: 1px solid #efefef;
        }

        .yes:hover {
          background: #B6EBFF72;
          color: #003543;
          margin-right: 16px;
        }

        .no:hover {
          background: #f5f5f5;
          border: 1px solid #efefef;
        }
      </style>
    </head>
    <body>
      <div class="container-content">
        <h1>
          Do you want to disconnect?
        </h1>
        
        <script>
          function logout() {
            var form = document.getElementById('op.logoutForm');
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'logout';
            input.value = 'yes';
            form.appendChild(input);
            form.submit();
          }
          function rpLogoutOnly() {
            var form = document.getElementById('op.logoutForm');
            form.submit();
          }
        </script>
        ${form}
        <button onclick="logout()" class="yes">
          Yes, disconnect
        </button>
        <button onclick="rpLogoutOnly()" class="no">
          No, take me back
        </button>
      </div>
    </body>
  </html>
  `;
};
