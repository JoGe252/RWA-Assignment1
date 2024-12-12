import { getCustomSession } from "../sessionCode.js";

export async function GET(req, res) {
  let session = await getCustomSession();
  let customersRole = session.role;
  console.log(customersRole);

  let email = session.email;

  console.log(email);

  return Response.json({});

}


