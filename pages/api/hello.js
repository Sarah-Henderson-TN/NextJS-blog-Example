/*
    This is just some high level example code of what else could be done to beef this project up even more
*/

export default function handler(req, res) {
  res.status(200).json({ text: "Hello!" });
}

export async function fetchPosts() {
  const response = await fetch("API Example.com");
  const data = await response.json();
  return data;
}

//lets say we have form data - you could use this to grab the form data that could then be inserted into a DB
export default function handler(req, res) {
  const email = req.body.email;
}