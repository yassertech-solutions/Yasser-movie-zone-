export default async function handler(req, res) {
  const token = process.env.TMDB_BEARER_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: "TMDB token is missing"
    });
  }

  const path = req.query.path;

  if (
    typeof path !== "string" ||
    !path.startsWith("/") ||
    path.includes("://") ||
    path.includes("..")
  ) {
    return res.status(400).json({
      error: "Invalid API path"
    });
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      }
    );

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "TMDB request failed"
    });
  }
}
