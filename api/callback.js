export default async function handler(req, res) {
  console.log("Callback endpoint called");  // Loguj, zda endpoint reaguje
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code } = req.query;
  console.log("Authorization code:", code);  // Loguj přijatý kód

  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided' });
  }

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
        scope: 'identify',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    return res.redirect(`/profile?username=${userData.username}&discriminator=${userData.discriminator}&avatar=${userData.avatar}`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
