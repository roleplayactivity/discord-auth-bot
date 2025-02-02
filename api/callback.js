// api/callback.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Získání authorization code z URL parametrů
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided' });
  }

  try {
    // Vytvoření požadavku na Discord pro získání tokenu
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID, // Tvůj Discord client_id
        client_secret: process.env.DISCORD_CLIENT_SECRET, // Tvůj Discord client_secret
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.DISCORD_REDIRECT_URI, // Tvá redirect_uri
        scope: 'identify',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    // Získání informací o uživatelském účtu z Discordu pomocí získaného access tokenu
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // Uložit si data (například do session nebo databáze)
    // Např. můžeš uložit userData do session, cookie nebo databáze

    // Přesměrování na profilovou stránku
    return res.redirect(`/profile?username=${userData.username}&discriminator=${userData.discriminator}&avatar=${userData.avatar}`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
