<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profil - Roleplay Activity</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <a href="#discord">Discord</a>
    <a href="#rules">Pravidla</a>
    <a href="#whitelist">Whitelist</a>
  </header>

  <div class="content">
    <h1>Profil</h1>

    <!-- Zobrazení údajů o uživatelském účtu -->
    <div class="profile-info">
      <img id="avatar" src="" alt="Avatar" width="100">
      <h2 id="username"></h2>
      <p>Discord Tag: <span id="discriminator"></span></p>
    </div>

    <!-- Informace o Whitelistu -->
    <div class="whitelist-status">
      <h3>Status Whitelistu:</h3>
      <p id="whitelist-status">Načítání...</p>
    </div>

    <!-- Tlačítko pro vyplnění žádosti -->
    <a href="whitelist-form.html" class="btn">Vyplnit žádost o Whitelist</a>

    <!-- Odkaz, pokud uživatel není na správném Discord serveru -->
    <p id="discord-check"></p>
  </div>

  <footer>
    <p>&copy; 2025 Roleplay Activity. Všechna práva vyhrazena.</p>
  </footer>

  <script>
    // Získání údajů z URL
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const discriminator = urlParams.get('discriminator');
    const avatar = urlParams.get('avatar');

    // Zobrazení údajů o uživatelském účtu
    document.getElementById('username').textContent = `${username}#${discriminator}`;
    document.getElementById('discriminator').textContent = `#${discriminator}`;
    document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${urlParams.get('user_id')}/${avatar}.png`;

    // Zkontrolování, jestli je uživatel na správném Discord serveru
    fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${urlParams.get('access_token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        const isInServer = data.some(guild => guild.id === 'V5Cr94MMsa'); // Ověření serveru
        if (!isInServer) {
          document.getElementById('discord-check').innerHTML = `<a href="https://discord.gg/V5Cr94MMsa" target="_blank">Pro vyplnění formuláře, musíš být na discordu ZDE</a>`;
        }
      });
  </script>

</body>
</html>
