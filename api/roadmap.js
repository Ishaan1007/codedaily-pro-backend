export default async function handler(req, res) {

  const prompt = req.body.prompt;

  const hfResponse = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.HF_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    }
  );

  const data = await hfResponse.json();

  res.status(200).json(data);
}
